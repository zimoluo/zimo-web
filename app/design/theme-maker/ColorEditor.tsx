"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import ColorEditorTypingArea from "./ColorEditorTypingArea";
import ThemeImageFormUploader from "./ThemeImageFormUploader";
import { useUser } from "@/components/contexts/UserContext";
import Image from "next/image";

export default function ColorEditor() {
  const { settings, updateColorScheme, updateSiteThemeColor } = useSettings();
  const { user } = useUser();

  const entries = ["primary", "saturated", "middle", "soft", "pastel", "light"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <ColorEditorTypingArea
          key={entry}
          setEntry={(colorData) =>
            updateColorScheme(
              entry as
                | "primary"
                | "saturated"
                | "middle"
                | "soft"
                | "pastel"
                | "light",
              0,
              colorData.split(",").map((num) => parseInt(num.trim())) as [
                number,
                number,
                number
              ]
            )
          }
          entry={JSON.stringify(
            settings.customThemeData[0].palette[
              entry as
                | "primary"
                | "saturated"
                | "middle"
                | "soft"
                | "pastel"
                | "light"
            ]
          ).replace(/^\[|\]$/g, "")}
        />
      ))}
      <ColorEditorTypingArea
        entry={settings.customThemeData[0].siteThemeColor}
        setEntry={(themeColor) =>
          updateSiteThemeColor(0, themeColor as `#${string}`)
        }
      />
      <ThemeImageFormUploader />
      {user && (
        <>
          <Image
            src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/account/themeImages/${
              user.sub
            }/bg-${0}?${new Date().getTime()}`}
            width={50}
            height={50}
            alt="awa"
            className="h-full w-auto"
            unoptimized={true}
          />
          <div className="h-20 w-20 bg-primary" />
        </>
      )}
    </div>
  );
}
