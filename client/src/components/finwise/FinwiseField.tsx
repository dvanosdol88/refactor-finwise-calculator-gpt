import * as React from "react";

import { cn } from "@/lib/utils";

type FinwiseFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  ui?: "legacy" | "finwise";
};

export default function FinwiseField({
  ui = "legacy",
  className,
  ...props
}: FinwiseFieldProps) {
  return (
    <div
      className={cn(
        ui === "finwise"
          ? "relative inline-flex items-center rounded-xl bg-background/70 border border-border px-4 py-2 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
          : "relative inline-flex items-center bg-transparent border border-card-border rounded-md shadow-none py-2 px-3 transition-all hover-elevate focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
        className,
      )}
      {...props}
    />
  );
}


