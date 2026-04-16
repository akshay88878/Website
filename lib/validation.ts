import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.email("Enter a valid email address."),
  address: z.string().min(8, "Enter a more complete address."),
  purpose: z
    .string()
    .min(12, "Tell us a bit more about your enquiry.")
    .max(800, "Purpose should stay under 800 characters.")
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
