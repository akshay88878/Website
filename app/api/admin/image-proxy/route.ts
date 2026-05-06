import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminStorage } from "@/lib/firebaseAdmin";

function getFirebaseStorageBucket() {
  return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 }
      );
    }

    const storage = getFirebaseAdminStorage();
    const bucketName = getFirebaseStorageBucket();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(path);

    // Generate a fresh signed URL for this request
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    // Fetch the image from the signed URL and return it
    const response = await fetch(signedUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public,max-age=86400", // Cache for 24 hours
        "Content-Length": buffer.byteLength.toString()
      }
    });
  } catch (error) {
    console.error("[image-proxy]", error);
    return NextResponse.json(
      { error: "Image proxy failed" },
      { status: 500 }
    );
  }
}
