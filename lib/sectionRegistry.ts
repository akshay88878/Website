import type { ComponentType } from "react";

import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import type { HomeSectionType, SectionConfig } from "@/types/siteConfig";

type RegistryComponent = ComponentType<{
  data: unknown;
  section: SectionConfig;
}>;

export const sectionRegistry: Record<HomeSectionType, RegistryComponent> = {
  hero: HeroSection as RegistryComponent,
  highlights: HighlightsSection as RegistryComponent
};

export function getConfiguredSections(sections: SectionConfig[]) {
  return [...sections]
    .filter((section) => section.enabled)
    .sort((left, right) => left.order - right.order);
}
