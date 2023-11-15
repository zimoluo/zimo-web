import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "@/styles/globals.css";

import ThemeInitializer from "@/components/themeUtil/ThemeInitializer";
import ThemeApplier from "@/components/themeUtil/ThemeApplier";
import MainPageFrame from "@/components/mainPage/MainPageFrame";
import MainPageElements from "@/components/mainPage/MainPageElements";
import { UserProvider } from "@/components/contexts/UserContext";
import { SettingsProvider } from "@/components/contexts/SettingsContext";
import GoogleOAuthProvider from "@/components/contexts/GoogleOAuthContext";
import MainPageEffect from "@/components/mainPage/MainPageEffect";

const mainFont = Work_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zimo Web",
  description: "The personal website of Zimo.",
  metadataBase: new URL("https://www.zimoluo.me/"),
  robots: "index,follow,max-image-preview:large",
  authors: [{ name: "Zimo", url: "https://github.com/zimoluo" }],
  openGraph: {
    type: "website",
    url: "http://zimoluo.me/",
    title: "Zimo Web",
    description: "The personal website of Zimo.",
    siteName: "Zimo Web",
  },
  icons: [
    {
      rel: "icon",
      url: "/website-favicon/favicon-32x32.png",
      type: "image/png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      url: "/website-favicon/favicon-96x96.png",
      type: "image/png",
      sizes: "96x96",
    },
    {
      rel: "icon",
      url: "/website-favicon/favicon-192x192.png",
      type: "image/png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      url: "/website-favicon/favicon-1024x1024.png",
      type: "image/png",
      sizes: "1024x1024",
    },
    {
      rel: "apple-touch-icon",
      url: "/website-favicon/favicon-180x180.png",
      type: "image/png",
      sizes: "1024x1024",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID || ""}
        >
          <UserProvider>
            <SettingsProvider>
              <ThemeInitializer>
                <ThemeApplier>
                  <MainPageFrame>
                    <MainPageEffect>
                      <MainPageElements>{children}</MainPageElements>
                    </MainPageEffect>
                  </MainPageFrame>
                </ThemeApplier>
              </ThemeInitializer>
            </SettingsProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
