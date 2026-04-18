import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  getSiteConfigWithSource,
  saveSiteConfig
} from "@/services/siteConfigStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { config, source } = await getSiteConfigWithSource();

  return NextResponse.json({
    success: true,
    source,
    data: config
  });
}

export async function POST(request: Request) {
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
}
