import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@clerk/nextjs/server";
import { prisma as db } from "@repo/database";
import crypto from "crypto";

export const runtime = 'nodejs';

// Encryption key should be at least 32 bytes for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string): { encryptedData: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex')
  };
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(new URL("/integrations/error", request.url));
    }

    if (!code) {
      return new NextResponse("No code provided", { status: 400 });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Encrypt sensitive credentials
    const credentialsToEncrypt = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date,
      email: userInfo.email,
    };

    const encryptedCredentials = encrypt(JSON.stringify(credentialsToEncrypt));

    // Store encrypted credentials in database
    await db.integration.upsert({
      where: {
        userId_type: {
          userId,
          type: "google",
        },
      },
      create: {
        userId,
        type: "google",
        credentials: encryptedCredentials,
      },
      update: {
        credentials: encryptedCredentials,
      },
    });

    // Redirect to success page with state parameter if provided
    const state = url.searchParams.get("state");
    const redirectUrl = new URL("/dashboard", request.url);
    if (state) {
      redirectUrl.searchParams.set("state", state);
    }
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(new URL("/integrations/error", request.url));
  }
}
