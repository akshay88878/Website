export type EnquiryStorageProvider = "firebase" | "mongodb" | "none" | "mock";
export type EnquiryEmailProvider = "smtp" | "none";

function normalizeStorageProvider(value?: string | null): EnquiryStorageProvider | null {
  if (
    value === "firebase" ||
    value === "mongodb" ||
    value === "none" ||
    value === "mock"
  ) {
    return value;
  }

  return null;
}

function normalizeEmailProvider(value?: string | null): EnquiryEmailProvider | null {
  if (value === "smtp" || value === "none") {
    return value;
  }

  return null;
}

export function getEnquiryStorageProvider(): EnquiryStorageProvider {
  return (
    normalizeStorageProvider(process.env.NEXT_PUBLIC_ENQUIRY_STORAGE_PROVIDER) ||
    normalizeStorageProvider(process.env.NEXT_PUBLIC_ENQUIRY_PROVIDER) ||
    "mock"
  );
}

export function getEnquiryEmailProvider(): EnquiryEmailProvider {
  return normalizeEmailProvider(process.env.NEXT_PUBLIC_ENQUIRY_EMAIL_PROVIDER) || "smtp";
}

export function getEnquirySuccessMessage(result: {
  stored: boolean;
  emailed: boolean;
}) {
  if (result.emailed) {
    return "Message sent successfully.";
  }

  if (result.stored) {
    return "Message submitted successfully.";
  }

  return "No enquiry delivery channel is configured.";
}
