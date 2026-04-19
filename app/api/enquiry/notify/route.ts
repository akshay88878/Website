import { NextResponse } from "next/server";

import { enquirySchema } from "@/lib/validation";
import {
  getEnquiryEmailProvider,
  getEnquirySuccessMessage
} from "@/services/enquiryConfig";
import { sendEnquiryNotificationEmail } from "@/services/enquiryMailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (getEnquiryEmailProvider() !== "smtp") {
    return NextResponse.json(
      {
        success: false,
        message: "SMTP enquiry email delivery is disabled."
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

  const emailResult = await sendEnquiryNotificationEmail(parsed.data);

  return NextResponse.json(
    {
      success: emailResult.delivered,
      message: emailResult.delivered
        ? getEnquirySuccessMessage({ stored: false, emailed: true })
        : emailResult.message
    },
    { status: emailResult.delivered ? 200 : 503 }
  );
}
