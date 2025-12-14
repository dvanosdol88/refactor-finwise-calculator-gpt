import * as React from "react";

import { cn } from "@/lib/utils";

type FinwiseCardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

const paddingClass: Record<NonNullable<FinwiseCardProps["padding"]>, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function FinwiseCard({
  className,
  padding = "md",
  ...props
}: FinwiseCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card border border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)]",
        paddingClass[padding],
        className,
      )}
      {...props}
    />
  );
}


