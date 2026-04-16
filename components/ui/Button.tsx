import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-glow hover:bg-brand-600 focus-visible:outline-brand-500",
  outline:
    "border border-surface-border bg-white text-ink-900 hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-brand-500",
  ghost:
    "bg-transparent text-ink-700 hover:bg-white/80 hover:text-ink-900 focus-visible:outline-brand-500"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-6 text-sm",
  sm: "h-10 px-4 text-sm",
  lg: "h-14 px-8 text-base"
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
