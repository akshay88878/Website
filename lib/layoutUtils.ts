import type { Alignment, ContainerWidth } from "@/types/siteConfig";

const textAlignClassMap: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
};

const flexAlignClassMap: Record<Alignment, string> = {
  left: "items-start justify-start",
  center: "items-center justify-center",
  right: "items-end justify-end"
};

const justifyClassMap: Record<Alignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end"
};

const containerWidthClassMap: Record<ContainerWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-none"
};

const blockAlignClassMap: Record<Alignment, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto"
};

export function getTextAlignClass(alignment: Alignment = "left") {
  return textAlignClassMap[alignment];
}

export function getFlexAlignClass(alignment: Alignment = "left") {
  return flexAlignClassMap[alignment];
}

export function getJustifyClass(alignment: Alignment = "left") {
  return justifyClassMap[alignment];
}

export function getContainerWidth(width: ContainerWidth = "default") {
  return containerWidthClassMap[width];
}

export function getBlockAlignClass(alignment: Alignment = "left") {
  return blockAlignClassMap[alignment];
}
