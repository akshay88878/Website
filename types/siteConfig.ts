export type Alignment = "left" | "center" | "right";
export type ContainerWidth = "narrow" | "default" | "wide" | "full";
export type ThemeMode = "light" | "dark";
export type HomeSectionType = "hero" | "highlights";

export interface LinkItem {
  label: string;
  url: string;
}

export interface NavigationItem extends LinkItem {}

export interface ThemeConfig {
  primary: string;
  mode: ThemeMode;
  backgroundPalette: string;
  sectionStyle: string;
  cardStyle: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface FooterConfig {
  text: string;
  links: LinkItem[];
  alignment: Alignment;
  brandName: string;
  contactHeading: string;
  socialHeading: string;
  email: string;
  address: string[];
}

export interface SectionConfig {
  type: HomeSectionType | string;
  enabled: boolean;
  order: number;
  alignment?: Alignment;
  width?: ContainerWidth;
}

export interface CtaConfig {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  illustrationSrc: string;
  illustrationAlt: string;
  alignment: Alignment;
  width: ContainerWidth;
  topSpacing: number;
}

export interface HighlightsContent {
  items: string[];
  alignment: Alignment;
  width: ContainerWidth;
}

export interface ProductItem {
  title: string;
  description: string;
  detailSections: ProductDetailSection[];
}

export type ProductDetailSectionStyle = "tags" | "list" | "text";

export interface ProductDetailSection {
  heading: string;
  style: ProductDetailSectionStyle;
  items?: string[];
  body?: string;
}

export interface ProductsPageContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  alignment?: Alignment;
  width?: ContainerWidth;
  cardLabels: {
    eyebrow: string;
  };
  products: ProductItem[];
}

export interface BlogPageContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  alignment?: Alignment;
  width?: ContainerWidth;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface TeamGroup {
  heading: string;
  members: TeamMember[];
}

export interface AboutPageContent {
  metaTitle: string;
  metaDescription: string;
  vision: {
    eyebrow: string;
    title: string;
    description: string;
    alignment?: Alignment;
    width?: ContainerWidth;
  };
  ceoMessage: {
    eyebrow: string;
    quote: string;
    signature: string;
    alignment?: Alignment;
    width?: ContainerWidth;
  };
  team: {
    eyebrow: string;
    title: string;
    groups: TeamGroup[];
    alignment?: Alignment;
    headingAlignment?: Alignment;
    contentAlignment?: Alignment;
    width?: ContainerWidth;
  };
}

export interface ContactPageContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  alignment?: Alignment;
  width?: ContainerWidth;
  info: {
    registeredAddressHeading: string;
    address: string[];
    emailHeading: string;
    email: string;
    socialHeading: string;
    socialLinks: LinkItem[];
  };
  form: {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    fields: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      addressLabel: string;
      addressPlaceholder: string;
      purposeLabel: string;
      purposePlaceholder: string;
    };
  };
}

export interface NavigationContent {
  items: NavigationItem[];
}

export interface SiteContent {
  siteName: string;
  siteDescription: string;
  navigation: NavigationContent;
  hero: HeroContent;
  highlights: HighlightsContent;
  productsPage: ProductsPageContent;
  blogPage: BlogPageContent;
  aboutPage: AboutPageContent;
  contactPage: ContactPageContent;
}

export interface SiteConfig {
  sections: SectionConfig[];
  content: SiteContent;
  theme: ThemeConfig;
  footer: FooterConfig;
}
