import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase";
import type { EnquiryInput } from "@/lib/validation";

type EnquiryResponse = {
  success: boolean;
  message: string;
};

type EnquiryProvider = "firebase" | "mongodb" | "mock";

function getEnquiryProvider(): EnquiryProvider {
  const provider = process.env.NEXT_PUBLIC_ENQUIRY_PROVIDER;

  if (provider === "firebase" || provider === "mongodb") {
    return provider;
  }

  return "mock";
}

async function submitToFirebase(values: EnquiryInput): Promise<EnquiryResponse> {
  try {
    const db = getFirebaseDb();

    await addDoc(collection(db, "enquiries"), {
      ...values,
      source: "website",
      createdAt: serverTimestamp()
    });

    return {
      success: true,
      message: "Enquiry stored in Firebase successfully."
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to store enquiry in Firebase."
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
          ? "Enquiry stored with MongoDB successfully."
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
  switch (getEnquiryProvider()) {
    case "firebase":
      return submitToFirebase(values);
    case "mongodb":
      return submitToMongo(values);
    default:
      await new Promise((resolve) => setTimeout(resolve, 900));

      return {
        success: true,
        message:
          "Local verification mode is active. Set NEXT_PUBLIC_ENQUIRY_PROVIDER to firebase or mongodb to persist submissions."
      };
  }
}
