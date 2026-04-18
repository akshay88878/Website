import { NextResponse } from "next/server";

import { getSiteConfigWithSource } from "@/services/siteConfigStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { config, source } = await getSiteConfigWithSource();

  return NextResponse.json({
    success: true,
    source,
    data: config
  });
}
