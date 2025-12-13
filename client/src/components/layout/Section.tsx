import React from "react";
import Container from "./Container";

export default function Section({
  id,
  alt = false,
  className = "",
  children,
}: {
  id?: string;
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${alt ? "bg-muted/40" : ""} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}


