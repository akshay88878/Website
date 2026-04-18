import { createElement } from "react";

import { sectionRegistry } from "@/lib/sectionRegistry";
import type { HomeSectionType, SectionConfig, SiteContent } from "@/types/siteConfig";

type SectionRendererProps = {
  sections: SectionConfig[];
  content: SiteContent;
};

function renderRegisteredSection<T extends HomeSectionType>(
  type: T,
  section: SectionConfig,
  content: SiteContent
) {
  const Component = sectionRegistry[type];

  return createElement(Component, {
    key: `${section.type}-${section.order}`,
    data: content[type] as unknown,
    section
  });
}

export function SectionRenderer({ sections, content }: SectionRendererProps) {
  return sections.map((section) => {
    const sectionType = section.type as HomeSectionType;
    const Component = sectionRegistry[sectionType];

    if (!Component || !content[sectionType]) {
      return null;
    }

    return renderRegisteredSection(sectionType, section, content);
  });
}
