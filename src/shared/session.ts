// shared/session.ts
import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET; // 🔒 do NOT use NEXT_PUBLIC_ here
if (!secretKey) throw new Error("SESSION_SECRET env var is required");

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: object) {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined = "") {
  try {
    if (!token) return;
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("❌ Failed to verify session", error);
    return null;
  }
}
