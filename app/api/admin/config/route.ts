import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  isFirebaseAdminAuthConfigured,
  verifyFirebaseAdminRequest
} from "@/services/firebaseAdminAuth";
import {
  getSiteConfigWithSource,
  saveSiteConfig
} from "@/services/siteConfigStore";

export const dynamic = "force-dynamic";

function createUnauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    {
      success: false,
      message
    },
    { status: 401 }
  );
}

function createAdminConfigurationResponse() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Firebase admin authentication is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID."
    },
    { status: 503 }
  );
}

export async function GET(request: Request) {
  if (!isFirebaseAdminAuthConfigured()) {
    return createAdminConfigurationResponse();
  }

  const verifiedAdmin = await verifyFirebaseAdminRequest(request);

  if (!verifiedAdmin.success) {
    return createUnauthorizedResponse(verifiedAdmin.message);
  }

  const { config, source } = await getSiteConfigWithSource();

  return NextResponse.json({
    success: true,
    source,
    data: config
  });
}

export async function POST(request: Request) {
  if (!isFirebaseAdminAuthConfigured()) {
    return createAdminConfigurationResponse();
  }

  const verifiedAdmin = await verifyFirebaseAdminRequest(request);

  if (!verifiedAdmin.success) {
    return createUnauthorizedResponse(verifiedAdmin.message);
  }

  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        message: "Request body must be valid JSON."
      },
      { status: 400 }
    );
  }

  try {
    const { config, source } = await saveSiteConfig(payload);

    ["/", "/products", "/blogs", "/about-us", "/contact-us", "/admin"].forEach(
      (route) => revalidatePath(route)
    );
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      source,
      data: config
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to save the site configuration."
      },
      { status: 503 }
    );
  }
}
