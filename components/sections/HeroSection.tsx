import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { getFlexAlignClass, getTextAlignClass } from "@/lib/layoutUtils";
import { cn } from "@/lib/utils";
import type { HeroContent, SectionConfig } from "@/types/siteConfig";

type HeroSectionProps = {
  data: HeroContent;
  section: SectionConfig;
};

export function HeroSection({ data, section }: HeroSectionProps) {
  const alignment = section.alignment || data.alignment;
  const spacingPercent = Math.max(0, Math.min(100, data.topSpacing));
  const mobileTopSpacing = `${spacingPercent * 0.05}rem`;
  const desktopTopSpacing = `${spacingPercent * 0.07}rem`;

  // Calculate dynamic grid columns based on image width percentage
  const imagePercent = data.imageWidthPercent ?? 50;
  const textPercent = 100 - imagePercent;
  const gridTemplateColumns = `minmax(0, ${textPercent}fr) minmax(0, ${imagePercent}fr)`;

  return (
    <section
      className="w-full pb-16 pt-[var(--hero-top-spacing-mobile)] lg:pb-24 lg:pt-[var(--hero-top-spacing-desktop)]"
      style={
        {
          "--hero-top-spacing-mobile": mobileTopSpacing,
          "--hero-top-spacing-desktop": desktopTopSpacing
        } as CSSProperties
      }
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: "100%"
        } as CSSProperties}
      >
        {/* Desktop 50-50 layout override */}
        <style>{`
          .hero-content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: calc(100vh - 5rem);
            align-items: center;
          }
          @media (min-width: 1024px) {
            .hero-content {
              grid-template-columns: ${gridTemplateColumns};
            }
          }
        `}</style>
        
        <div className="hero-content">
          <div className={cn("min-w-0 animate-fade-in-up", getTextAlignClass(alignment))}>
            <span className="theme-eyebrow inline-flex whitespace-pre-line rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] shadow-sm">
              {data.eyebrow}
            </span>
            <h1 className="mt-8 whitespace-pre-line text-5xl font-bold leading-tight md:text-6xl">
              {data.title}
            </h1>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-lg lg:max-w-none">
              {data.description}
            </p>

            <div
              className={cn(
                "mt-8 flex flex-col gap-4 sm:flex-row",
                alignment === "center"
                  ? "sm:justify-center"
                  : alignment === "right"
                    ? "sm:justify-end"
                    : "sm:justify-start",
                getFlexAlignClass(alignment)
              )}
            >
              <Link href={data.primaryCta.href}>
                <Button size="lg">{data.primaryCta.label}</Button>
              </Link>
              <Link href={data.secondaryCta.href}>
                <Button variant="outline" size="lg">
                  {data.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl min-w-0 animate-fade-in-up lg:max-w-none">
            <div className="absolute inset-8 rounded-full bg-[var(--theme-primary-soft)] blur-3xl" />
            <div className="absolute left-8 top-10 h-24 w-24 animate-pulse-ring rounded-full bg-cyan-200/70 blur-xl" />
            <div className="glass-panel relative overflow-hidden p-5">
              <Image
                src={data.illustrationSrc}
                alt={data.illustrationAlt}
                width={880}
                height={760}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
