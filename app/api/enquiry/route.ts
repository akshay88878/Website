import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";
import { enquirySchema } from "@/lib/validation";
import {
  getEnquiryEmailProvider,
  getEnquirySuccessMessage,
  getEnquiryStorageProvider
} from "@/services/enquiryConfig";
import { sendEnquiryNotificationEmail } from "@/services/enquiryMailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (getEnquiryStorageProvider() !== "mongodb") {
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB enquiry storage is disabled."
      },
      { status: 503 }
    );
  }

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

    if (getEnquiryEmailProvider() === "none") {
      return NextResponse.json(
        {
          success: true,
          message: getEnquirySuccessMessage({ stored: true, emailed: false })
        },
        { status: 201 }
      );
    }

    const emailResult = await sendEnquiryNotificationEmail(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: emailResult.delivered
          ? getEnquirySuccessMessage({ stored: true, emailed: true })
          : `Your message was saved, but the email notification was not sent. ${emailResult.message}`
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
