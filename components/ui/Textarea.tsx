import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[148px] w-full rounded-2xl border border-surface-border bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition duration-200 placeholder:text-ink-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
