"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@/components/contexts/ThemeContext";
import { usePathname } from "next/navigation";

interface Props {
  children?: ReactNode;
}

export default function ThemeInitializer({ children }: Props) {
  const pathname = usePathname();
  const theme = useMemo(() => {
    let initialTheme: ThemeAvailable = "photos";
    if (pathname.startsWith("/projects")) {
      initialTheme = "projects";
    }
    return initialTheme;
  }, [pathname]);

  return <ThemeProvider defaultThemeKey={theme}>{children}</ThemeProvider>;
}
