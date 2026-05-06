"use client";

import { type ChangeEvent, useRef, useState } from "react";

import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getFirebaseAuth, hasFirebaseConfig } from "@/lib/firebase";

type FirebaseImageFieldProps = {
  value: string;
  onChange: (value: string) => void;
  uploadPath: string;
  previewAlt: string;
};

function sanitizeFileName(fileName: string) {
  const normalized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "image";
}

export function FirebaseImageField({
  value,
  onChange,
  uploadPath,
  previewAlt
}: FirebaseImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!hasFirebaseConfig()) {
      setError("Firebase is not configured for Storage uploads.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setMessage(null);
    setError(null);

    try {
      // Get the current user's ID token
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("You must be logged in to upload images.");
      }

      const idToken = await currentUser.getIdToken();

      // Upload via backend endpoint
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadPath", uploadPath);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = (await response.json()) as { success: boolean; url?: string; message?: string };

      if (!result.success || !result.url) {
        throw new Error(result.message || "Upload succeeded but no URL returned");
      }

      onChange(result.url);
      setMessage("Image uploaded to Firebase Storage.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the image to Firebase Storage."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          value={value}
          onChange={(event) => {
            setMessage(null);
            setError(null);
            onChange(event.target.value);
          }}
          placeholder="Paste an image URL or upload to Firebase Storage"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface-subtle p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={previewAlt}
            className="h-44 w-full rounded-2xl object-cover"
          />
        </div>
      ) : null}

      {message ? <p className="text-xs text-emerald-700">{message}</p> : null}
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
