"use client";

import type { CSSProperties } from "react";

import { Footer } from "@/components/layout/Footer";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getConfiguredSections } from "@/lib/sectionRegistry";
import { buildThemeStyleVariables } from "@/lib/theme";
import type { SiteConfig } from "@/types/siteConfig";

type SiteConfigPreviewProps = {
  config: SiteConfig;
};

export function SiteConfigPreview({ config }: SiteConfigPreviewProps) {
  const sections = getConfiguredSections(config.sections);
  const style = buildThemeStyleVariables(config.theme) as CSSProperties;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-surface-border bg-white">
      <div style={style} data-theme={config.theme.mode} className="page-shell">
        <SectionRenderer sections={sections} content={config.content} />
        <Footer footer={config.footer} />
      </div>
    </div>
  );
}
