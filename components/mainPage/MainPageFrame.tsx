"use client";

import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function MainPageFrame({ children }: Props) {
  return (
    <section className="flex flex-col min-h-screen text-primary">
      {children}
    </section>
  );
}
