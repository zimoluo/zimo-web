import { getSubFromSessionToken } from "@/lib/dataLayer/server/accountStateManager";
import { uploadThemeImageToServer } from "@/lib/dataLayer/server/themeServerManager";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const tokenUserSub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is uploading theme images.");
    }

    const formData = await req.formData();

    const index = formData.get("index");
    const suffix = formData.get("suffix");
    const file: any = formData.getAll("files")[0];
    console.log(index, suffix, file);

    await uploadThemeImageToServer(
      `account/themeImages/${tokenUserSub}/bg-${index}.${suffix}`,
      file.stream()
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (e) {
    console.error("Error in uploading theme image:", e);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
