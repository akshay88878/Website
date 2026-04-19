import type { JWTPayload } from "jose";
import { jwtVerify, SignJWT } from "jose";

type AdminSessionPayload = {
  provider?: "firebase" | "password";
  uid?: string;
  email?: string;
};

type VerifiedAdminSession = JWTPayload &
  AdminSessionPayload & {
    role: "admin";
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

export async function verifyAdminSessionToken(
  token?: string
): Promise<VerifiedAdminSession | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (payload.role !== "admin") {
      return null;
    }

    return payload as VerifiedAdminSession;
  } catch {
    return null;
  }
}

export function getAdminSessionTokenFromRequest(request: Request) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  return token || undefined;
}

export async function verifyAdminRequest(request: Request) {
  return verifyAdminSessionToken(getAdminSessionTokenFromRequest(request));
}
