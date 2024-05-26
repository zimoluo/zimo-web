import type { Metadata } from "next";
import {
  Roboto_Mono,
  Lora,
  Open_Sans,
  Pacifico,
  Work_Sans,
} from "next/font/google";
import "@/styles/globals.css";
import ThemeApplier from "@/components/themeUtil/ThemeApplier";
import MainPageFrame from "@/components/mainPage/MainPageFrame";
import MainPageElements from "@/components/mainPage/MainPageElements";
import { UserProvider } from "@/components/contexts/UserContext";
import { SettingsProvider } from "@/components/contexts/SettingsContext";
import GoogleOAuthProvider from "@/components/contexts/GoogleOAuthContext";
import MainPageEffect from "@/components/mainPage/MainPageEffect";
import { baseUrl } from "@/lib/constants/navigationFinder";
import { ToastProvider } from "@/components/contexts/ToastContext";
import ThemeDataInitializer from "@/components/themeUtil/ThemeDataInitializer";

const mainFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

const fancyFont = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
  weight: "400",
});

const tabularFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const monoFont = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const serifFont = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const environment = (process.env.VERCEL_ENV ?? "development").toLowerCase();

export const metadata: Metadata = {
  title: "Zimo Web",
  description: "The personal website of Zimo.",
  metadataBase: new URL("https://www.zimoluo.me/"),
  robots: "index,follow,max-image-preview:large",
  authors: [{ name: "Zimo", url: "https://github.com/zimoluo" }],
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Zimo Web",
    description: "The personal website of Zimo.",
    siteName: "Zimo Web",
  },
  icons: [
    {
      rel: "icon",
      url: `/website-favicon/${environment}/favicon-32x32.png`,
      type: "image/png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      url: `/website-favicon/${environment}/favicon-96x96.png`,
      type: "image/png",
      sizes: "96x96",
    },
    {
      rel: "icon",
      url: `/website-favicon/${environment}/favicon-192x192.png`,
      type: "image/png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      url: `/website-favicon/${environment}/favicon-1024x1024.png`,
      type: "image/png",
      sizes: "1024x1024",
    },
    {
      rel: "apple-touch-icon",
      url: `/website-favicon/${environment}/favicon-180x180.png`,
      type: "image/png",
      sizes: "180x180",
    },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zimo Web",
  },
  keywords: "Zimo Web, Zimo Luo, Zimo, Personal Website",
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.variable} ${monoFont.variable} ${tabularFont.variable} ${serifFont.variable} ${fancyFont.variable} font-main`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID || ""}
        >
          <UserProvider>
            <SettingsProvider>
              <ToastProvider>
                <ThemeDataInitializer>
                  <ThemeApplier>
                    <MainPageFrame>
                      <MainPageEffect>
                        <MainPageElements>{children}</MainPageElements>
                      </MainPageEffect>
                    </MainPageFrame>
                  </ThemeApplier>
                </ThemeDataInitializer>
              </ToastProvider>
            </SettingsProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
