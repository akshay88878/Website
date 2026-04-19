import { NextResponse } from "next/server";
import { z } from "zod";

import {
  isFirebaseAdminAuthConfigured,
  verifyFirebaseAdminIdToken
} from "@/services/firebaseAdminAuth";
import {
  isAdminAuthConfigured,
  verifyAdminPassword
} from "@/services/adminPassword";
import { createAdminSessionToken } from "@/services/adminSession";

const passwordLoginSchema = z.object({
  password: z.string().min(1, "Password is required.")
});

const firebaseLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required.")
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  const firebaseParsed = firebaseLoginSchema.safeParse(payload);

  if (firebaseParsed.success) {
    if (!isFirebaseAdminAuthConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Firebase admin authentication is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID and ADMIN_JWT_SECRET."
        },
        { status: 503 }
      );
    }

    const verifiedIdentity = await verifyFirebaseAdminIdToken(firebaseParsed.data.idToken);

    if (!verifiedIdentity.success) {
      return NextResponse.json(
        {
          success: false,
          message: verifiedIdentity.message
        },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken({
      provider: "firebase",
      uid: verifiedIdentity.identity.uid,
      email: verifiedIdentity.identity.email ?? undefined
    });

    return NextResponse.json({
      success: true,
      sessionToken: token
    });
  }

  const passwordParsed = passwordLoginSchema.safeParse(payload);

  if (!passwordParsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid login payload."
      },
      { status: 400 }
    );
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Admin password authentication is not configured. Set ADMIN_PASSWORD_HASH and ADMIN_JWT_SECRET."
      },
      { status: 503 }
    );
  }

  const validPassword = await verifyAdminPassword(passwordParsed.data.password);

  if (!validPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials."
      },
      { status: 401 }
    );
  }

  const token = await createAdminSessionToken({
    provider: "password"
  });

  return NextResponse.json({
    success: true,
    sessionToken: token
  });
}
