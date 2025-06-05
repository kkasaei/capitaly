import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

export const runtime = 'nodejs';

const oauth2Client = new google.auth.OAuth2(
  process.env.INTEGRATION_GOOGLE_CLIENT_ID,
  process.env.INTEGRATION_GOOGLE_CLIENT_SECRET,
  process.env.INTEGRATION_GOOGLE_CALLBACK
);

// Scopes for Google API access
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const state = url.searchParams.get("state") || crypto.randomBytes(16).toString('hex');

    // Generate OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      state,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/integrations/error", request.url));
  }
}
