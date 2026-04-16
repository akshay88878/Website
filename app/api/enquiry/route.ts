import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";
import { enquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Request body must be valid JSON."
      },
      { status: 400 }
    );
  }

  const parsed = enquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid enquiry payload.",
        errors: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  try {
    const db = await getMongoDb();

    await db.collection("enquiries").insertOne({
      ...parsed.data,
      source: "website",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry stored successfully."
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to store enquiry with MongoDB. Check environment configuration."
      },
      { status: 500 }
    );
  }
}
