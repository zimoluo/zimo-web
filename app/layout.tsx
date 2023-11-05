import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import ThemeInitializer from "@/components/themeUtil/ThemeInitializer";
import ThemeColorApplier from "@/components/themeUtil/ThemeColorApplier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zimo Web",
  description: "A personal website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeInitializer>
          <ThemeColorApplier>{children}</ThemeColorApplier>
        </ThemeInitializer>
      </body>
    </html>
  );
}
