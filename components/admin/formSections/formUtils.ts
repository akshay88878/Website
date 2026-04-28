import type { HomeSectionType, SectionConfig, SiteConfig } from "@/types/siteConfig";

export const contactFormFields = [
  ["nameLabel", "Name label"],
  ["namePlaceholder", "Name placeholder"],
  ["emailLabel", "Email label"],
  ["emailPlaceholder", "Email placeholder"],
  ["addressLabel", "Address label"],
  ["addressPlaceholder", "Address placeholder"],
  ["purposeLabel", "Purpose label"],
  ["purposePlaceholder", "Purpose placeholder"]
] as const;

export function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function joinLines(value: string[]) {
  return value.join("\n");
}

// Parse paragraphs - split on || first, then fall back to newlines
// This allows editing both new || format and legacy newline format
export function parseParagraphs(value: string) {
  // Try splitting on || first (new format)
  if (value.includes("||")) {
    return value
      .split("||")
      .map((para) => para.trim())
      .filter(Boolean);
  }
  // Fall back to splitting on newlines (legacy format)
  return value
    .split("\n")
    .map((para) => para.trim())
    .filter(Boolean);
}

// Join paragraphs with || delimiter for consistent editing
export function joinParagraphs(value: string[]) {
  return value.join(" || ");
}

export function replaceAt<T>(items: T[], index: number, nextValue: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? nextValue : item));
}

export function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function setField<T>(target: T, path: string[], value: unknown): T {
  const [head, ...rest] = path;

  if (!head) {
    return value as T;
  }

  const record = target as Record<string, unknown>;

  return {
    ...record,
    [head]: rest.length ? setField(record[head], rest, value) : value
  } as T;
}

export function getSection(config: SiteConfig, type: HomeSectionType): SectionConfig {
  return (
    config.sections.find((section) => section.type === type) ?? {
      type,
      enabled: true,
      order: type === "hero" ? 1 : 2,
      alignment: type === "hero" ? "left" : "center",
      width: "wide"
    }
  );
}
