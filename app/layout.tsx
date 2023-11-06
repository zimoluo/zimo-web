import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import ThemeInitializer from "@/components/themeUtil/ThemeInitializer";
import ThemeApplier from "@/components/themeUtil/ThemeApplier";
import MainPageFrame from "@/components/mainPage/MainPageFrame";
import MainPageElements from "@/components/mainPage/MainPageElements";
import { UserProvider } from "@/components/contexts/UserContext";
import { SettingsProvider } from "@/components/contexts/SettingsContext";

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
        <UserProvider>
          <SettingsProvider>
            <ThemeInitializer>
              <ThemeApplier>
                <MainPageFrame>
                  <MainPageElements>{children}</MainPageElements>
                </MainPageFrame>
              </ThemeApplier>
            </ThemeInitializer>
          </SettingsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
