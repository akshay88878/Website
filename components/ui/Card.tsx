import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-white/70 bg-white/90 shadow-soft backdrop-blur transition-transform duration-300",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export { Card };
