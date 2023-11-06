import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import ThemeInitializer from "@/components/themeUtil/ThemeInitializer";
import ThemeColorApplier from "@/components/themeUtil/ThemeColorApplier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zimo Web",
  description: "A personal website.",
  robots: "index,follow,max-image-preview:large",
  authors: [{ name: "Zimo", url: "https://github.com/zimoluo" }],
  openGraph: {
    type: "website",
    url: "http://zimoluo.me/",
    title: "Zimo Web",
    description: "My Website Description",
    siteName: "My Website",
    images: [
      {
        url: "https://example.com/og.png",
      },
    ],
  },
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
