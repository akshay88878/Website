"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitEnquiry } from "@/lib/enquiry";
import { type EnquiryInput, enquirySchema } from "@/lib/validation";
import type { ContactPageContent } from "@/types/siteConfig";

type EnquiryFormProps = {
  formConfig: ContactPageContent["form"];
};

export function EnquiryForm({ formConfig }: EnquiryFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      purpose: ""
    }
  });

  const onSubmit = async (values: EnquiryInput) => {
    setServerMessage(null);
    setServerError(null);

    try {
      const response = await submitEnquiry(values);

      if (!response.success) {
        setServerError(response.message);
        return;
      }

      setServerMessage(response.message);
      reset();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to submit the enquiry."
      );
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.nameLabel}
        </label>
        <Input
          id="name"
          placeholder={formConfig.fields.namePlaceholder}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.emailLabel}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={formConfig.fields.emailPlaceholder}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.addressLabel}
        </label>
        <Input
          id="address"
          placeholder={formConfig.fields.addressPlaceholder}
          aria-invalid={Boolean(errors.address)}
          {...register("address")}
        />
        {errors.address ? (
          <p className="mt-2 text-sm text-rose-600">{errors.address.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="purpose"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.purposeLabel}
        </label>
        <Textarea
          id="purpose"
          placeholder={formConfig.fields.purposePlaceholder}
          aria-invalid={Boolean(errors.purpose)}
          {...register("purpose")}
        />
        {errors.purpose ? (
          <p className="mt-2 text-sm text-rose-600">{errors.purpose.message}</p>
        ) : null}
      </div>

      {serverMessage ? (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          aria-live="polite"
        >
          {serverMessage}
        </div>
      ) : null}

      {serverError ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          aria-live="polite"
        >
          {serverError}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending enquiry...
          </>
        ) : (
          formConfig.submitLabel
        )}
      </Button>
    </form>
  );
}
