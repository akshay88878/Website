import { z } from "zod";

import { defaultSiteConfig } from "@/models/defaultSiteConfig";
import type { SiteConfig } from "@/types/siteConfig";

const alignmentSchema = z.enum(["left", "center", "right"]);
const containerWidthSchema = z.enum(["narrow", "default", "wide", "full"]);
const heroTopSpacingSchema = z.preprocess((value) => {
  if (value === "tight") {
    return 20;
  }

  if (value === "default") {
    return 50;
  }

  if (value === "relaxed") {
    return 80;
  }

  return value;
}, z.number().min(0).max(100));
const productDetailSectionSchema = z.object({
  heading: z.string(),
  style: z.enum(["tags", "list", "text"]),
  items: z.array(z.string().min(1)).optional(),
  body: z.string().optional()
});
const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  image: z.string().min(1)
});
const teamGroupSchema = z.object({
  heading: z.string(),
  members: z.array(teamMemberSchema)
});
const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1)
});

const productSchema = z.preprocess((value) => {
  if (!isPlainObject(value)) {
    return value;
  }

  if (Array.isArray(value.detailSections)) {
    return value;
  }

  const detailSections = [
    Array.isArray(value.techStack) && value.techStack.length
      ? {
          heading: "Tech Stack",
          style: "tags",
          items: value.techStack
        }
      : null,
    Array.isArray(value.features) && value.features.length
      ? {
          heading: "Features",
          style: "list",
          items: value.features
        }
      : null,
    typeof value.useCase === "string" && value.useCase.trim()
      ? {
          heading: "Use Case",
          style: "text",
          body: value.useCase
        }
      : null
  ].filter(Boolean);

  return {
    ...value,
    detailSections
  };
}, z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  imageSize: z.enum(["small", "medium", "large"]).optional(),
  detailSections: z.array(productDetailSectionSchema)
}));

const aboutTeamSchema = z.preprocess((value) => {
  if (!isPlainObject(value)) {
    return value;
  }

  if (Array.isArray(value.groups)) {
    return value;
  }

  if (Array.isArray(value.members)) {
    return {
      ...value,
      groups: [
        {
          heading: "",
          members: value.members
        }
      ]
    };
  }

  return value;
}, z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  groups: z.array(teamGroupSchema),
  alignment: alignmentSchema.optional(),
  headingAlignment: alignmentSchema.optional(),
  contentAlignment: alignmentSchema.optional(),
  width: containerWidthSchema.optional()
}));

const siteConfigSchema = z.object({
  sections: z.array(
    z.object({
      type: z.string().min(1),
      enabled: z.boolean(),
      order: z.number(),
      alignment: alignmentSchema.optional(),
      width: containerWidthSchema.optional()
    })
  ),
  content: z.object({
    siteName: z.string().min(1),
    siteDescription: z.string().min(1),
    navigation: z.object({
      items: z.array(linkSchema)
    }),
    hero: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      primaryCta: z.object({
        label: z.string().min(1),
        href: z.string().min(1)
      }),
      secondaryCta: z.object({
        label: z.string().min(1),
        href: z.string().min(1)
      }),
      illustrationSrc: z.string().min(1),
      illustrationAlt: z.string().min(1),
      alignment: alignmentSchema,
      width: containerWidthSchema,
      topSpacing: heroTopSpacingSchema
    }),
    highlights: z.object({
      items: z.array(z.string().min(1)),
      alignment: alignmentSchema,
      width: containerWidthSchema
    }),
    productsPage: z.object({
      metaTitle: z.string().min(1),
      metaDescription: z.string().min(1),
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      alignment: alignmentSchema.optional(),
      width: containerWidthSchema.optional(),
      cardLabels: z.object({
        eyebrow: z.string().min(1)
      }),
      products: z.array(productSchema)
    }),
    blogPage: z.object({
      metaTitle: z.string().min(1),
      metaDescription: z.string().min(1),
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      paragraphs: z.array(z.string().min(1)),
      imageSrc: z.string().min(1),
      imageAlt: z.string().min(1),
      alignment: alignmentSchema.optional(),
      width: containerWidthSchema.optional()
    }),
    aboutPage: z.object({
      metaTitle: z.string().min(1),
      metaDescription: z.string().min(1),
      vision: z.object({
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        alignment: alignmentSchema.optional(),
        width: containerWidthSchema.optional()
      }),
      ceoMessage: z.object({
        eyebrow: z.string().min(1),
        quote: z.string().min(1),
        signature: z.string().min(1),
        alignment: alignmentSchema.optional(),
        width: containerWidthSchema.optional()
      }),
      team: aboutTeamSchema
    }),
    contactPage: z.object({
      metaTitle: z.string().min(1),
      metaDescription: z.string().min(1),
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      alignment: alignmentSchema.optional(),
      width: containerWidthSchema.optional(),
      info: z.object({
        registeredAddressHeading: z.string().min(1),
        address: z.array(z.string().min(1)),
        emailHeading: z.string().min(1),
        email: z.string().min(1),
        socialHeading: z.string().min(1),
        socialLinks: z.array(linkSchema)
      }),
      form: z.object({
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        submitLabel: z.string().min(1),
        fields: z.object({
          nameLabel: z.string().min(1),
          namePlaceholder: z.string().min(1),
          emailLabel: z.string().min(1),
          emailPlaceholder: z.string().min(1),
          addressLabel: z.string().min(1),
          addressPlaceholder: z.string().min(1),
          purposeLabel: z.string().min(1),
          purposePlaceholder: z.string().min(1)
        })
      })
    })
  }),
  theme: z.object({
    primary: z.string().min(4),
    mode: z.enum(["light", "dark"]),
    backgroundPalette: z.string().min(1),
    sectionStyle: z.string().min(1),
    cardStyle: z.string().min(1),
    primaryColor: z.string().min(4).optional(),
    backgroundColor: z.string().min(4).optional(),
    textColor: z.string().min(4).optional(),
    accentColor: z.string().min(4).optional()
  }),
  footer: z.object({
    text: z.string().min(1),
    links: z.array(linkSchema),
    alignment: alignmentSchema,
    brandName: z.string().min(1),
    contactHeading: z.string().min(1),
    socialHeading: z.string().min(1),
    email: z.string().min(1),
    address: z.array(z.string().min(1))
  })
});

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(override)) {
      const current = result[key];

      if (Array.isArray(current)) {
        result[key] = Array.isArray(value) ? value : current;
        continue;
      }

      if (isPlainObject(current) && isPlainObject(value)) {
        result[key] = deepMerge(current, value);
        continue;
      }

      result[key] = value;
    }

    return result as T;
  }

  return (override ?? base) as T;
}

function buildValidationMessage(path: PropertyKey[], message: string) {
  if (!path.length) {
    return `Validation failed: ${message}.`;
  }

  const formattedPath = path
    .map((segment) =>
      typeof segment === "number"
        ? `[${segment + 1}]`
        : typeof segment === "symbol"
          ? String(segment)
          : segment
    )
    .join(".")
    .replace(/\.\[/g, "[");

  return `Validation failed for ${formattedPath}: ${message}.`;
}

export function parseSiteConfig(
  input: unknown
): { success: true; data: SiteConfig } | { success: false; message: string } {
  const mergedConfig = deepMerge(defaultSiteConfig, input);
  const parsed = siteConfigSchema.safeParse(mergedConfig);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return {
      success: false,
      message: buildValidationMessage(issue?.path ?? [], issue?.message ?? "Invalid config")
    };
  }

  return {
    success: true,
    data: {
      ...parsed.data,
      sections: [...parsed.data.sections].sort((left, right) => left.order - right.order)
    } satisfies SiteConfig
  };
}

export function normalizeSiteData(input: unknown): SiteConfig {
  const parsed = parseSiteConfig(input);

  if (!parsed.success) {
    return defaultSiteConfig;
  }

  return parsed.data;
}
