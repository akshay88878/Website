"use client";

import { startTransition, useCallback, useEffect, useState, type FormEvent } from "react";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { Loader2, LogOut, Save } from "lucide-react";

import {
  adminEditorSections,
  type AdminEditorSectionId
} from "@/components/admin/adminSections";
import { SiteConfigForm, type EditorMode } from "@/components/admin/SiteConfigForm";
import { SiteConfigPreview } from "@/components/admin/SiteConfigPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getErrorDetails } from "@/lib/errorDetails";
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

type LoginResponse = {
  success: boolean;
  message?: string;
};

function getSaveErrorMessage(error: unknown) {
  const firebaseMessage =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : null;

  if (firebaseMessage?.toLowerCase().includes("missing or insufficient permissions")) {
    return (
      "Firestore denied the save request. Your admin account is signed in, but the Firestore " +
      "security rules are blocking writes to site_configs/default-site-config."
    );
  }

  return error instanceof Error ? error.message : "Unable to save the configuration.";
}

function getMessageClassName(tone: MessageTone) {
  return tone === "error"
    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700";
}

function logAdminSaveError(stage: string, error: unknown, extra?: Record<string, unknown>) {
  if (extra) {
    console.error(`[admin/save] ${stage}`, extra, getErrorDetails(error), error);
    return;
  }

  console.error(`[admin/save] ${stage}`, getErrorDetails(error), error);
}

export function AdminPanel() {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [activeSection, setActiveSection] = useState<AdminEditorSectionId>("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHumanConfirmed, setIsHumanConfirmed] = useState(false);
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
  const activeEditorSection =
    adminEditorSections.find((section) => section.id === activeSection) ?? adminEditorSections[0];

  const resetAdminAccess = useCallback((nextMessage?: string, tone: MessageTone = "success") => {
    setActiveSection("home");
    setStatus("unauthorized");
    setEmail("");
    setPassword("");
    setIsHumanConfirmed(false);
    setEditorValue("");
    setDraftConfig(null);
    setPreviewConfig(null);
    setParseError(null);
    setSource(null);
    setMessageTone(tone);
    setMessage(nextMessage ?? null);
  }, []);

  const getAdminIdToken = useCallback(async () => {
    if (!usesFirebaseLogin) {
      return null;
    }

    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
      return null;
    }

    return currentUser.getIdToken();
  }, [usesFirebaseLogin]);

  const loadConfig = useCallback(async () => {
    const idToken = await getAdminIdToken();

    if (!idToken) {
      await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
      resetAdminAccess();
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/config", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      const result = (await response.json()) as ConfigResponse;

      if (response.status === 401) {
        await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
        resetAdminAccess(result.message || "Your admin session expired. Sign in again.", "error");
        return;
      }

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
    } catch (error) {
      resetAdminAccess(
        error instanceof Error ? error.message : "Unable to load the admin config.",
        "error"
      );
    }
  }, [getAdminIdToken, resetAdminAccess]);

  useEffect(() => {
    let isMounted = true;

    async function initializeAdminAccess() {
      let nextMessage: string | undefined;
      let nextTone: MessageTone = "success";

      if (usesFirebaseLogin) {
        try {
          const firebaseAuth = getFirebaseAuth();

          await setPersistence(firebaseAuth, browserLocalPersistence);

          if (firebaseAuth.currentUser) {
            await firebaseSignOut(firebaseAuth).catch(() => undefined);
          }
        } catch (error) {
          if (!isMounted) {
            return;
          }

          nextTone = "error";
          nextMessage =
            error instanceof Error ? error.message : "Unable to prepare Firebase admin access.";
        }
      }

      if (isMounted) {
        resetAdminAccess(
          nextMessage || (!usesFirebaseLogin ? "Firebase admin login is not configured." : undefined),
          !usesFirebaseLogin ? "error" : nextTone
        );
      }
    }

    void initializeAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [resetAdminAccess, usesFirebaseLogin]);

  const handleFormChange = useCallback((nextConfig: SiteConfig) => {
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
  }, []);

  const handleEditorChange = useCallback((value: string) => {
    setEditorValue(value);
    setMessage(null);
  }, []);

  // Debounce JSON parsing by 500ms to prevent excessive re-renders during typing
  useEffect(() => {
    const parseTimer = setTimeout(() => {
      startTransition(() => {
        try {
          const parsedJson = JSON.parse(editorValue);
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
    }, 500);

    return () => clearTimeout(parseTimer);
  }, [editorValue]);

  const handleLogin = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAuthenticating(true);
    setMessage(null);

    if (!usesFirebaseLogin) {
      setMessageTone("error");
      setMessage("Firebase admin login is not configured.");
      setIsAuthenticating(false);
      return;
    }

    const firebaseAuth = getFirebaseAuth();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessageTone("error");
      setMessage("Enter your Firebase admin email and password.");
      setIsAuthenticating(false);
      return;
    }

    if (!isHumanConfirmed) {
      setMessageTone("error");
      setMessage('Confirm "I am not a robot" before signing in.');
      setIsAuthenticating(false);
      return;
    }

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);

      const credential = await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success) {
        if (firebaseAuth.currentUser) {
          await firebaseSignOut(firebaseAuth).catch(() => undefined);
        }

        setMessageTone("error");
        setMessage(result.message || "Unable to sign in.");
        return;
      }

      setEmail("");
      setPassword("");
      setIsHumanConfirmed(false);
      await loadConfig();
    } catch (error) {
      if (firebaseAuth.currentUser) {
        await firebaseSignOut(firebaseAuth).catch(() => undefined);
      }

      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsAuthenticating(false);
    }
  }, [email, isHumanConfirmed, loadConfig, password, usesFirebaseLogin]);

  const handleSave = useCallback(async () => {
    if (!draftConfig || parseError) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      if (!usesFirebaseLogin) {
        setMessageTone("error");
        setMessage("Firebase admin login is not configured.");
        return;
      }

      const idToken = await getAdminIdToken();

      if (!idToken) {
        resetAdminAccess("Your Firebase admin session has expired. Sign in again.", "error");
        return;
      }

      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(draftConfig)
      });

      const result = (await response.json().catch(() => null)) as ConfigResponse | null;

      if (response.status === 401) {
        console.error("[admin/save] API save returned unauthorized response.", {
          status: response.status,
          body: result
        });
        await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
        resetAdminAccess(
          result?.message || "Your Firebase admin session has expired. Sign in again.",
          "error"
        );
        return;
      }

      if (response.ok && result?.success && result.data) {
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
        setMessage(`Configuration saved successfully (${result.source || "saved"}).`);
        return;
      }

      console.error("[admin/save] API save failed.", {
        status: response.status,
        body: result
      });
      setMessageTone("error");
      setMessage(result?.message || "Unable to save the configuration.");
    } catch (error) {
      logAdminSaveError("Save flow failed.", error, {
        source: source ?? "unknown",
        hasDraftConfig: Boolean(draftConfig)
      });
      setMessageTone("error");
      setMessage(getSaveErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }, [draftConfig, getAdminIdToken, parseError, resetAdminAccess, source, usesFirebaseLogin]);

  const handleLogout = useCallback(async () => {
    if (usesFirebaseLogin) {
      await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
    }

    resetAdminAccess("Signed out.");
  }, [resetAdminAccess, usesFirebaseLogin]);

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
              : "Firebase admin login is not configured. Add the Firebase web config and allowed admin email values to enable the editor."}
          </p>

          {usesFirebaseLogin ? (
            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
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
                  required
                />
              </div>

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
                  autoComplete="current-password"
                  required
                />
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3 text-sm text-ink-800">
                <input
                  type="checkbox"
                  checked={isHumanConfirmed}
                  onChange={(event) => setIsHumanConfirmed(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border border-surface-border text-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]"
                />
                <span>I am not a robot</span>
              </label>

              {message ? <div className={getMessageClassName(messageTone)}>{message}</div> : null}

              <Button
                type="submit"
                className="w-full"
                disabled={isAuthenticating || !isHumanConfirmed}
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In with Firebase"
                )}
              </Button>
            </form>
          ) : message ? (
            <div className={`mt-8 ${getMessageClassName(messageTone)}`}>{message}</div>
          ) : null}
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

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)]">
        {draftConfig ? (
          <SiteConfigForm
            config={draftConfig}
            activeSection={activeSection}
            editorMode={editorMode}
            editorValue={editorValue}
            onChange={handleFormChange}
            onActiveSectionChange={setActiveSection}
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

        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Live Preview</h2>
            <p className="mt-2 text-sm">
              Showing the {activeEditorSection.label} page using the current draft structure and
              formatting.
            </p>
          </Card>

          {previewConfig ? (
            <SiteConfigPreview config={previewConfig} activeSection={activeSection} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
