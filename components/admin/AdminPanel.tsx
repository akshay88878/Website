"use client";

import { startTransition, useEffect, useState, type FormEvent } from "react";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { Loader2, LogOut, Save } from "lucide-react";

import { SiteConfigForm, type EditorMode } from "@/components/admin/SiteConfigForm";
import { SiteConfigPreview } from "@/components/admin/SiteConfigPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getFirebaseAuth, hasFirebaseConfig } from "@/lib/firebase";
import { parseSiteConfig } from "@/lib/normalizeSiteData";
import type { SiteConfig } from "@/types/siteConfig";

type AdminStatus = "loading" | "unauthorized" | "ready";
type MessageTone = "success" | "error";

type ConfigResponse = {
  success: boolean;
  source?: string;
  data?: SiteConfig;
  message?: string;
};

function getMessageClassName(tone: MessageTone) {
  return tone === "error"
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700";
}

export function AdminPanel() {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("form");
  const [editorValue, setEditorValue] = useState("");
  const [draftConfig, setDraftConfig] = useState<SiteConfig | null>(null);
  const [previewConfig, setPreviewConfig] = useState<SiteConfig | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [source, setSource] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const usesFirebaseLogin = hasFirebaseConfig();

  async function loadConfig() {
    setStatus("loading");
    setMessage(null);

    const response = await fetch("/api/admin/config", {
      cache: "no-store"
    });

    if (response.status === 401) {
      setStatus("unauthorized");
      return;
    }

    const result = (await response.json()) as ConfigResponse;

    if (!response.ok || !result.data) {
      setStatus("unauthorized");
      setMessageTone("error");
      setMessage(result.message || "Unable to load the admin config.");
      return;
    }

    const parsed = parseSiteConfig(result.data);

    if (!parsed.success) {
      setStatus("unauthorized");
      setMessageTone("error");
      setMessage(parsed.message);
      return;
    }

    setDraftConfig(parsed.data);
    setPreviewConfig(parsed.data);
    setEditorValue(JSON.stringify(parsed.data, null, 2));
    setSource(result.source || null);
    setParseError(null);
    setStatus("ready");
  }

  useEffect(() => {
    void loadConfig();
  }, []);

  function handleFormChange(nextConfig: SiteConfig) {
    setMessage(null);
    setDraftConfig(nextConfig);

    startTransition(() => {
      const parsed = parseSiteConfig(nextConfig);

      if (!parsed.success) {
        setEditorValue(JSON.stringify(nextConfig, null, 2));
        setParseError(parsed.message);
        return;
      }

      setDraftConfig(parsed.data);
      setPreviewConfig(parsed.data);
      setEditorValue(JSON.stringify(parsed.data, null, 2));
      setParseError(null);
    });
  }

  function handleEditorChange(value: string) {
    setEditorValue(value);
    setMessage(null);

    startTransition(() => {
      try {
        const parsedJson = JSON.parse(value);
        const parsed = parseSiteConfig(parsedJson);

        if (!parsed.success) {
          setParseError(parsed.message);
          return;
        }

        setDraftConfig(parsed.data);
        setPreviewConfig(parsed.data);
        setParseError(null);
      } catch {
        setParseError("Invalid JSON syntax. Fix the JSON before saving.");
      }
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthenticating(true);
    setMessage(null);

    const firebaseAuth = usesFirebaseLogin ? getFirebaseAuth() : null;

    try {
      let response: Response;

      if (firebaseAuth) {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credential.user.getIdToken();

        response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idToken })
        });
      } else {
        response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password })
        });
      }

      const result = (await response.json()) as ConfigResponse;

      if (!response.ok) {
        if (firebaseAuth?.currentUser) {
          await firebaseSignOut(firebaseAuth).catch(() => undefined);
        }

        setMessageTone("error");
        setMessage(result.message || "Unable to sign in.");
        return;
      }

      setEmail("");
      setPassword("");
      await loadConfig();
    } catch (error) {
      if (firebaseAuth?.currentUser) {
        await firebaseSignOut(firebaseAuth).catch(() => undefined);
      }

      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function handleSave() {
    if (!draftConfig || parseError) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(draftConfig)
      });

      const result = (await response.json()) as ConfigResponse;

      if (!response.ok || !result.data) {
        setMessageTone("error");
        setMessage(result.message || "Unable to save the configuration.");
        return;
      }

      const parsed = parseSiteConfig(result.data);

      if (!parsed.success) {
        setMessageTone("error");
        setMessage(parsed.message);
        return;
      }

      setDraftConfig(parsed.data);
      setPreviewConfig(parsed.data);
      setEditorValue(JSON.stringify(parsed.data, null, 2));
      setSource(result.source || null);
      setParseError(null);
      setMessageTone("success");
      setMessage(
        `Configuration saved successfully${result.source ? ` (${result.source})` : ""}.`
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    if (usesFirebaseLogin) {
      await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
    }

    setStatus("unauthorized");
    setMessageTone("success");
    setMessage("Signed out.");
    setEmail("");
    setPassword("");
    setEditorValue("");
    setDraftConfig(null);
    setPreviewConfig(null);
    setParseError(null);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--theme-primary)]" />
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            Admin Access
          </p>
          <h1 className="mt-4 text-3xl font-bold">Secure configuration login</h1>
          <p className="mt-4 text-sm">
            {usesFirebaseLogin
              ? "Sign in with your Firebase email and password account to open the admin editor."
              : "Enter the admin password to open the structured site configuration editor."}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {usesFirebaseLogin ? (
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-ink-800"
                >
                  Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@lomasai.com"
                  autoComplete="email"
                />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-ink-800"
              >
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                autoComplete={usesFirebaseLogin ? "current-password" : "off"}
              />
            </div>

            {message ? <div className={getMessageClassName(messageTone)}>{message}</div> : null}

            <Button type="submit" className="w-full" disabled={isAuthenticating}>
              {isAuthenticating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : usesFirebaseLogin ? (
                "Sign In with Firebase"
              ) : (
                "Access Admin"
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            Admin Panel
          </p>
          <h1 className="mt-3 text-4xl font-bold">Minimal Config CMS</h1>
          <p className="mt-3 text-sm">
            Update the centralized site configuration through a structured editor, preview
            changes live, and save the validated result.
          </p>
          {source ? (
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
              Active source: {source}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              void handleLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button onClick={() => void handleSave()} disabled={isSaving || Boolean(parseError)}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Config
              </>
            )}
          </Button>
        </div>
      </div>

      {message ? <div className={getMessageClassName(messageTone)}>{message}</div> : null}

      {parseError ? (
        <div className={getMessageClassName("error")}>
          {parseError}
          <div className="mt-2 text-xs text-rose-600">
            Preview stays on the last valid draft until this is corrected.
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        {draftConfig ? (
          <SiteConfigForm
            config={draftConfig}
            editorMode={editorMode}
            editorValue={editorValue}
            onChange={handleFormChange}
            onEditorModeChange={setEditorMode}
            onJsonChange={handleEditorChange}
          />
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-bold">Configuration Editor</h2>
            <p className="mt-2 text-sm text-ink-600">
              Loading the current configuration state.
            </p>
          </Card>
        )}

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Live Preview</h2>
            <p className="mt-2 text-sm">
              Preview reflects the last valid normalized draft for homepage sections, theme,
              and footer content.
            </p>
          </Card>

          {previewConfig ? <SiteConfigPreview config={previewConfig} /> : null}
        </div>
      </div>
    </div>
  );
}
