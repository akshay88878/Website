"use client";

import { type ChangeEvent, useRef, useState } from "react";

import { Loader2, Upload } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getFirebaseStorage, hasFirebaseConfig } from "@/lib/firebase";

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
      const storage = getFirebaseStorage();
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      const objectPath = `${uploadPath}/${fileName}`;
      const storageRef = ref(storage, objectPath);

      await uploadBytes(storageRef, file, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "public,max-age=31536000"
      });

      const downloadUrl = await getDownloadURL(storageRef);

      onChange(downloadUrl);
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
