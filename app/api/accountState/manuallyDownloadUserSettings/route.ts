import {
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/dataLayer/server/accountStateManager";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const tokenUserSub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is trying to download their settings.");
    }

    const { websiteSettings: tokenUserSettings } = (await getUserDataBySub(
      tokenUserSub,
      ["websiteSettings"]
    )) as unknown as { websiteSettings: SettingsState | null };

    return new Response(
      JSON.stringify({
        exists: tokenUserSettings !== null,
        downloadedSettings: tokenUserSettings,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in trying to download user settings:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
