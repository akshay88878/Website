export type AdminEditorSectionId =
  | "home"
  | "products"
  | "blogs"
  | "about"
  | "contact";

export const adminEditorSections: {
  id: AdminEditorSectionId;
  label: string;
  path: string;
  eyebrow: string;
  description: string;
}[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    eyebrow: "Landing",
    description: "Branding, navigation, homepage content, footer, and theme."
  },
  {
    id: "products",
    label: "Products",
    path: "/products",
    eyebrow: "Catalog",
    description: "Products page SEO, intro copy, and product cards."
  },
  {
    id: "blogs",
    label: "Blogs",
    path: "/blogs",
    eyebrow: "Stories",
    description: "Blog page SEO, article copy, and cover image."
  },
  {
    id: "about",
    label: "About Us",
    path: "/about-us",
    eyebrow: "Company",
    description: "Vision, CEO message, and team details."
  },
  {
    id: "contact",
    label: "Contact Us",
    path: "/contact-us",
    eyebrow: "Reach Us",
    description: "Contact details, social links, and enquiry form labels."
  }
];
