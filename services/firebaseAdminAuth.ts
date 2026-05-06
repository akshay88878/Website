import { createRemoteJWKSet, jwtVerify } from "jose";

type FirebaseAdminIdentity = {
  uid: string;
  email: string | null;
  name: string | null;
};

type FirebaseVerificationResult =
  | {
      success: true;
      identity: FirebaseAdminIdentity;
    }
  | {
      success: false;
      message: string;
    };

const firebaseJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

function getFirebaseProjectId() {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_FIREBASE_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isFirebaseAdminAuthConfigured() {
  return Boolean(getFirebaseProjectId());
}

export function getFirebaseAdminIdTokenFromRequest(request: Request) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authorizationHeader.slice("Bearer ".length).trim();

  return idToken || null;
}

export async function verifyFirebaseAdminIdToken(
  idToken: string
): Promise<FirebaseVerificationResult> {
  const projectId = getFirebaseProjectId();

  if (!projectId) {
    return {
      success: false,
      message:
        "Firebase admin authentication is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID."
    };
  }

  try {
    const { payload } = await jwtVerify(idToken, firebaseJwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId
    });

    const uid =
      typeof payload.user_id === "string"
        ? payload.user_id
        : typeof payload.sub === "string"
          ? payload.sub
          : null;

    if (!uid) {
      return {
        success: false,
        message: "Unable to determine the Firebase user identity."
      };
    }

    const email = typeof payload.email === "string" ? payload.email : null;
    const name = typeof payload.name === "string" ? payload.name : null;
    const emailVerified = payload.email_verified === true;
    const allowedAdminEmails = getAllowedAdminEmails();

    if (allowedAdminEmails.size) {
      if (!email) {
        return {
          success: false,
          message: "Admin access requires a Firebase account with an email address."
        };
      }

      if (!emailVerified) {
        return {
          success: false,
          message: "The Firebase admin account email must be verified."
        };
      }

      if (!allowedAdminEmails.has(email.toLowerCase())) {
        return {
          success: false,
          message: "This Firebase account is not authorized for admin access."
        };
      }
    }

    return {
      success: true,
      identity: {
        uid,
        email,
        name
      }
    };
  } catch {
    return {
      success: false,
      message: "Unable to verify the Firebase sign-in token."
    };
  }
}

export async function verifyFirebaseAdminRequest(
  request: Request
): Promise<FirebaseVerificationResult> {
  const idToken = getFirebaseAdminIdTokenFromRequest(request);

  if (!idToken) {
    return {
      success: false,
      message: "Missing Firebase admin authorization token."
    };
  }

  return verifyFirebaseAdminIdToken(idToken);
}
