import { getContainerWidth, getTextAlignClass } from "@/lib/layoutUtils";
import { cn } from "@/lib/utils";
import type { HighlightsContent, SectionConfig } from "@/types/siteConfig";

type HighlightsSectionProps = {
  data: HighlightsContent;
  section: SectionConfig;
};

export function HighlightsSection({ data, section }: HighlightsSectionProps) {
  const alignment = section.alignment || data.alignment;
  const width = section.width || data.width;

  return (
    <section className="container pb-16 lg:pb-24">
      <div className={cn("mx-auto", getContainerWidth(width))}>
        <div className={cn("grid gap-3 sm:grid-cols-3", getTextAlignClass(alignment))}>
          {data.items.map((item) => (
            <div
              key={item}
              className="glass-panel rounded-2xl px-4 py-4 text-sm font-medium text-[color:var(--theme-body-text)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
