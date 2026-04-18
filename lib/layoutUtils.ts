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

const containerWidthClassMap: Record<ContainerWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-none"
};

export function getTextAlignClass(alignment: Alignment = "left") {
  return textAlignClassMap[alignment];
}

export function getFlexAlignClass(alignment: Alignment = "left") {
  return flexAlignClassMap[alignment];
}

export function getContainerWidth(width: ContainerWidth = "default") {
  return containerWidthClassMap[width];
}
