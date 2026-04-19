import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase";
import type { EnquiryInput } from "@/lib/validation";
import {
  getEnquiryEmailProvider,
  getEnquiryStorageProvider,
  getEnquirySuccessMessage,
  type EnquiryEmailProvider
} from "@/services/enquiryConfig";

type EnquiryResponse = {
  success: boolean;
  message: string;
};

async function sendSmtpNotification(values: EnquiryInput): Promise<EnquiryResponse> {
  try {
    const response = await fetch("/api/enquiry/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json().catch(() => null)) as Partial<EnquiryResponse> | null;

    return {
      success: response.ok,
      message:
        result?.message ||
        (response.ok ? getEnquirySuccessMessage({ stored: false, emailed: true }) : "Unable to send message email.")
    };
  } catch {
    return {
      success: false,
      message: "Network error while sending the email notification."
    };
  }
}

async function submitToFirebase(
  values: EnquiryInput,
  emailProvider: EnquiryEmailProvider
): Promise<EnquiryResponse> {
  try {
    const db = getFirebaseDb();

    await addDoc(collection(db, "enquiries"), {
      ...values,
      source: "website",
      createdAt: serverTimestamp()
    });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to store enquiry in Firebase."
    };
  }

  if (emailProvider === "none") {
    return {
      success: true,
      message: getEnquirySuccessMessage({ stored: true, emailed: false })
    };
  }

  try {
    const emailResult = await sendSmtpNotification(values);

    return {
      success: true,
      message: emailResult.success
        ? getEnquirySuccessMessage({ stored: true, emailed: true })
        : `Your message was saved, but the email notification was not sent. ${emailResult.message}`
    };
  } catch {
    return {
      success: true,
      message: "Your message was saved, but the email notification could not be delivered."
    };
  }
}

async function submitToMongo(values: EnquiryInput): Promise<EnquiryResponse> {
  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as Partial<EnquiryResponse>;

    return {
      success: response.ok,
      message:
        result.message ||
        (response.ok
          ? "Message sent successfully."
          : "Unable to store enquiry with MongoDB.")
    };
  } catch {
    return {
      success: false,
      message: "Network error while submitting the enquiry."
    };
  }
}

export async function submitEnquiry(values: EnquiryInput): Promise<EnquiryResponse> {
  const storageProvider = getEnquiryStorageProvider();
  const emailProvider = getEnquiryEmailProvider();

  switch (storageProvider) {
    case "firebase":
      return submitToFirebase(values, emailProvider);
    case "mongodb":
      return submitToMongo(values);
    case "none":
      if (emailProvider === "smtp") {
        return sendSmtpNotification(values);
      }

      return {
        success: false,
        message:
          "No enquiry delivery channel is configured. Enable Firebase or MongoDB storage, SMTP email, or both."
      };
    default:
      await new Promise((resolve) => setTimeout(resolve, 900));

      return {
        success: true,
        message:
          "Local verification mode is active. Set NEXT_PUBLIC_ENQUIRY_STORAGE_PROVIDER to firebase, mongodb, or none, and NEXT_PUBLIC_ENQUIRY_EMAIL_PROVIDER to smtp or none."
      };
  }
}
