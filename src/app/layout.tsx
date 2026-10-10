import type { Metadata, Viewport } from "next";
import {
  Roboto_Mono,
  Lora,
  Open_Sans,
  Pacifico,
  Inter,
} from "next/font/google";
import "@/src/styles/globals.css";
import { MainPageFrame } from "@/src/features/shell";
import { MainPageElements } from "@/src/features/shell";
import GoogleOAuthProvider from "@/src/features/account/ui/GoogleOAuthProvider";
import { baseUrl } from "@/src/lib/site";
import { NotificationHost } from "@/src/features/notifications";
import { SettingsHost } from "@/src/features/settings";
import { defaultRobotsMeta } from "@/src/lib/site";
import { ThemeHost } from "@/src/features/theme/runtime/ThemeHost";
import { WindowLayer } from "@/src/features/windows";
import { OverlayLayer } from "@/src/features/overlays";
import { ThemeRuntime } from "@/src/features/theme/runtime/ThemeRuntime";
import { SchemeHost } from "@/src/features/theme/runtime/SchemeHost";
import { getTheme, resolve, effectiveScheme, formatHex, StudioPickerHost, type ThemeId } from "@/src/features/theme";
import { readRenderPreferences } from "@/src/features/theme/runtime/render-preferences";

const mainFont = Inter({
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
  robots: defaultRobotsMeta,
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
  keywords: "Zimo Web, Zimo Luo, Zimo, Personal Website",
};

export async function generateViewport(): Promise<Viewport> {
  const { theme, scheme } = await readRenderPreferences();
  const source = getTheme(theme as ThemeId);
  return { themeColor: formatHex(resolve(source, effectiveScheme(source, scheme)).roles.brand) };
}

export default async function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { theme, scheme, serif, tableOfContents, navigation } = await readRenderPreferences();

  return (
    <html className={`${mainFont.variable} ${monoFont.variable} ${tabularFont.variable} ${serifFont.variable} ${fancyFont.variable}`} lang="en" data-theme={theme} data-scheme={effectiveScheme(getTheme(theme as ThemeId), scheme)} data-serif={String(serif)} data-toc={String(tableOfContents)} data-nav={navigation}>
      <body
        className="font-sans antialiased"
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID || ""}
        >
          <SettingsHost />
          <ThemeRuntime />
          <SchemeHost />
          <ThemeHost />
          <NotificationHost />
          <WindowLayer />
          <OverlayLayer />
          <StudioPickerHost />
          <MainPageFrame><MainPageElements>{children}</MainPageElements></MainPageFrame>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
