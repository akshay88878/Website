import nodemailer from "nodemailer";

import type { EnquiryInput } from "@/lib/validation";

type EnquiryEmailResult = {
  delivered: boolean;
  message: string;
};

function getSmtpConfiguration() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.ENQUIRY_NOTIFICATION_TO || user;
  const secure =
    process.env.SMTP_SECURE === "true" ||
    (process.env.SMTP_SECURE == null && port === 465);

  if (!host || !Number.isFinite(port) || !user || !pass || !from || !to) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    to,
    secure
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtml(values: EnquiryInput) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">New Website Enquiry</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tbody>
          <tr>
            <td style="padding: 8px 0; font-weight: 700; width: 120px;">Name</td>
            <td style="padding: 8px 0;">${escapeHtml(values.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Email</td>
            <td style="padding: 8px 0;">${escapeHtml(values.email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Address</td>
            <td style="padding: 8px 0;">${escapeHtml(values.address)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700; vertical-align: top;">Purpose</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(values.purpose)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function buildText(values: EnquiryInput) {
  return [
    "New Website Enquiry",
    "",
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Address: ${values.address}`,
    "",
    "Purpose:",
    values.purpose
  ].join("\n");
}

export async function sendEnquiryNotificationEmail(
  values: EnquiryInput
): Promise<EnquiryEmailResult> {
  const smtpConfiguration = getSmtpConfiguration();

  if (!smtpConfiguration) {
    return {
      delivered: false,
      message:
        "SMTP email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, and ENQUIRY_NOTIFICATION_TO."
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfiguration.host,
      port: smtpConfiguration.port,
      secure: smtpConfiguration.secure,
      auth: {
        user: smtpConfiguration.user,
        pass: smtpConfiguration.pass
      }
    });

    await transporter.sendMail({
      from: smtpConfiguration.from,
      to: smtpConfiguration.to,
      replyTo: values.email,
      subject: `New enquiry from ${values.name}`,
      text: buildText(values),
      html: buildHtml(values)
    });

    return {
      delivered: true,
      message: "Enquiry email sent successfully."
    };
  } catch (error) {
    return {
      delivered: false,
      message:
        error instanceof Error
          ? `Unable to send enquiry email: ${error.message}`
          : "Unable to send enquiry email."
    };
  }
}
