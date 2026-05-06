import { NextResponse } from "next/server";

import {
  getFirebaseAdminIdTokenFromRequest,
  verifyFirebaseAdminIdToken
} from "@/services/firebaseAdminAuth";
import { getFirebaseAdminStorage } from "@/lib/firebaseAdmin";

function getFirebaseStorageBucket() {
  return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
}

export async function POST(request: Request) {
  const idToken = getFirebaseAdminIdTokenFromRequest(request);

  if (!idToken) {
    return NextResponse.json(
      { success: false, message: "Missing authorization token." },
      { status: 401 }
    );
  }

  const verifiedIdentity = await verifyFirebaseAdminIdToken(idToken);

  if (!verifiedIdentity.success) {
    return NextResponse.json(
      { success: false, message: verifiedIdentity.message },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uploadPath = formData.get("uploadPath") as string;

    if (!file || !uploadPath) {
      return NextResponse.json(
        { success: false, message: "Missing file or uploadPath." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase()}`;
    const objectPath = `${uploadPath}/${fileName}`;

    const storage = getFirebaseAdminStorage();
    const bucketName = getFirebaseStorageBucket();
    const bucket = storage.bucket(bucketName);
    const file_obj = bucket.file(objectPath);

    await file_obj.save(Buffer.from(buffer), {
      metadata: {
        contentType: file.type || "application/octet-stream",
        cacheControl: "public,max-age=31536000"
      }
    });

    // Return a proxy URL that will generate fresh signed URLs on demand
    const proxyUrl = `/api/admin/image-proxy?path=${encodeURIComponent(objectPath)}`;

    return NextResponse.json({
      success: true,
      url: proxyUrl
    });
  } catch (error) {
    console.error("[admin/upload]", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed."
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 60;
