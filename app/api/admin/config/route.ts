import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/services/adminSession";
import {
  getSiteConfigWithSource,
  saveSiteConfig
} from "@/services/siteConfigStore";

export const dynamic = "force-dynamic";

function createUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized"
    },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  const adminSession = await verifyAdminRequest(request);

  if (!adminSession) {
    return createUnauthorizedResponse();
  }

  const { config, source } = await getSiteConfigWithSource();

  return NextResponse.json({
    success: true,
    source,
    data: config
  });
}

export async function POST(request: Request) {
  const adminSession = await verifyAdminRequest(request);

  if (!adminSession) {
    return createUnauthorizedResponse();
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
