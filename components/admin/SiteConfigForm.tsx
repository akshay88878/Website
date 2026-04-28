"use client";

import { memo } from "react";
import { FileJson, LayoutTemplate } from "lucide-react";
import {
  adminEditorSections,
  type AdminEditorSectionId
} from "@/components/admin/adminSections";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import {
  HomeFormSection,
  ProductsFormSection,
  BlogsFormSection,
  AboutFormSection,
  ContactFormSection,
  ThemeFormSection,
  EditorCard
} from "@/components/admin/formSections";
import type { SiteConfig } from "@/types/siteConfig";

export type EditorMode = "form" | "json";

type SiteConfigFormProps = {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
  editorMode: EditorMode;
  editorValue: string;
  onChange: (nextConfig: SiteConfig) => void;
  onActiveSectionChange: (section: AdminEditorSectionId) => void;
  onEditorModeChange: (mode: EditorMode) => void;
  onJsonChange: (value: string) => void;
};

// Map section IDs to their form components
const sectionComponents: Record<AdminEditorSectionId, React.ComponentType<any>> = {
  home: HomeFormSection,
  products: ProductsFormSection,
  blogs: BlogsFormSection,
  about: AboutFormSection,
  contact: ContactFormSection,
  theme: ThemeFormSection
};

const SiteConfigFormComponent = function SiteConfigForm({
  config,
  activeSection,
  editorMode,
  editorValue,
  onChange,
  onActiveSectionChange,
  onEditorModeChange,
  onJsonChange
}: SiteConfigFormProps) {
  const activeSectionConfig =
    adminEditorSections.find((section) => section.id === activeSection) ?? adminEditorSections[0];
  const SectionComponent = sectionComponents[activeSection];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">Configuration Editor</h2>
            <p className="mt-2 text-sm text-ink-600">
              Use the form editor for normal updates. Switch to raw JSON only for direct
              model-level edits.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-surface-border bg-surface-subtle p-1">
            <Button
              size="sm"
              variant={editorMode === "form" ? "primary" : "ghost"}
              onClick={() => onEditorModeChange("form")}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Structured form
            </Button>
            <Button
              size="sm"
              variant={editorMode === "json" ? "primary" : "ghost"}
              onClick={() => onEditorModeChange("json")}
            >
              <FileJson className="mr-2 h-4 w-4" />
              Advanced JSON
            </Button>
          </div>
        </div>

        {editorMode === "form" ? (
          <div className="mt-6 space-y-4 border-t border-surface-border pt-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--theme-primary)]">
                Edit By Section
              </p>
              <p className="mt-2 text-sm text-ink-600">
                Choose the page section from the top row and edit only that area.
              </p>
            </div>

            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <div className="flex w-max min-w-full gap-3">
                {adminEditorSections.map((section) => {
                  const isActive = section.id === activeSection;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)] shadow-soft"
                          : "border-surface-border bg-white hover:border-[color:var(--theme-primary-border)] hover:bg-surface-subtle"
                      }`}
                      onClick={() => onActiveSectionChange(section.id)}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-surface-border bg-surface-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-primary)]">
                Current Section
              </p>
              <h3 className="mt-2 text-lg font-bold">{activeSectionConfig.label}</h3>
              <p className="mt-2 text-sm text-ink-600">{activeSectionConfig.description}</p>
            </div>
          </div>
        ) : null}
      </Card>

      {editorMode === "json" ? (
        <EditorCard
          title="Raw Configuration"
          description="Direct JSON editing remains available for advanced and bulk changes."
        >
          <Textarea
            value={editorValue}
            onChange={(event) => onJsonChange(event.target.value)}
            className="min-h-[820px] font-mono text-xs leading-6"
            spellCheck={false}
          />
        </EditorCard>
      ) : (
        SectionComponent && <SectionComponent config={config} onChange={onChange} />
      )}
    </div>
  );
};

export const SiteConfigForm = memo(
  SiteConfigFormComponent,
  (prevProps, nextProps) =>
    prevProps.activeSection === nextProps.activeSection &&
    prevProps.editorMode === nextProps.editorMode &&
    prevProps.config === nextProps.config &&
    prevProps.editorValue === nextProps.editorValue &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onActiveSectionChange === nextProps.onActiveSectionChange &&
    prevProps.onEditorModeChange === nextProps.onEditorModeChange &&
    prevProps.onJsonChange === nextProps.onJsonChange
);
