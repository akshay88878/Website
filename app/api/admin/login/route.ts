import { NextResponse } from "next/server";
import { z } from "zod";

import {
  isFirebaseAdminAuthConfigured,
  verifyFirebaseAdminIdToken
} from "@/services/firebaseAdminAuth";

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
            "Firebase admin authentication is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID."
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

    return NextResponse.json({
      success: true,
      identity: verifiedIdentity.identity
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid login payload."
    },
    { status: 400 }
  );
}
