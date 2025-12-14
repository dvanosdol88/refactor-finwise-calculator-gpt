import * as React from "react";

import { cn } from "@/lib/utils";

type FinwiseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "solid";
};

export default function FinwiseButton({
  className,
  variant = "outline",
  type = "button",
  ...props
}: FinwiseButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-background/70 text-primary shadow-sm hover:bg-background",
        className,
      )}
      {...props}
    />
  );
}


