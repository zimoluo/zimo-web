import {
  checkIfUserExistsBySub,
  getSubFromSessionToken,
  getUserDataBySub,
  uploadUserToServer,
} from "@/lib/dataLayer/server/accountStateManager";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { localSettings } = await request.json();

  try {
    const sub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (!sub) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
      });
    }

    if (!checkIfUserExistsBySub(sub)) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 500,
        headers: {
          "Set-Cookie": `session_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
            0
          ).toUTCString()}`,
        },
      });
    }

    let downloadedUser = (await getUserDataBySub(sub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ])) as unknown as UserData;

    if (downloadedUser === null) {
      throw new Error("Failed to download user.");
    }

    let downloadedSettings = null;

    if (localSettings.syncSettings) {
      if (downloadedUser.websiteSettings === null) {
        downloadedUser = { ...downloadedUser, websiteSettings: localSettings };
        let userToUpload: Partial<UserData> = { ...downloadedUser };
        delete userToUpload.sub;
        await uploadUserToServer(userToUpload as Omit<UserData, "sub">, sub);
      } else {
        downloadedSettings = downloadedUser.websiteSettings;
      }
    }

    const integratedUser = { ...downloadedUser, sub };

    return new Response(
      JSON.stringify({ integratedUser, downloadedSettings, exists: true }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
