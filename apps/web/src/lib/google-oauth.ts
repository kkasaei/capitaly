import { prisma as db } from "@repo/database";
import crypto from "crypto";

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

function decrypt(encryptedData: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function getDecryptedGoogleCredentials(userId: string) {
  const integration = await db.integration.findUnique({
    where: {
      userId_type: {
        userId,
        type: "google",
      },
    },
  });

  if (!integration) {
    throw new Error("Google integration not found");
  }

  const { encryptedData, iv, authTag } = integration.credentials as any;
  const decryptedData = decrypt(encryptedData, iv, authTag);
  return JSON.parse(decryptedData);
}

export { encrypt, decrypt }; 