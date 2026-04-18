import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE = "lomas_admin_session";

type AdminSessionPayload = {
  provider?: "firebase" | "password";
  uid?: string;
  email?: string;
};

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_JWT_SECRET.");
  }

  return new TextEncoder().encode(secret);
}

export function hasAdminSessionConfig() {
  return Boolean(process.env.ADMIN_JWT_SECRET);
}

export async function createAdminSessionToken(payload: AdminSessionPayload = {}) {
  return new SignJWT({ role: "admin", ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12
  };
}
