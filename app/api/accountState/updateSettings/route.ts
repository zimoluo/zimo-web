import {
  checkIfUserExistsBySub,
  getSubFromSessionToken,
  getUserDataBySub,
  uploadUserToServer,
} from "@/lib/dataLayer/server/accountStateManager";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const { settings, sub } = await request.json();
    const tokenUser = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (sub !== tokenUser) {
      throw new Error("User does not match.");
    }

    if (!(await checkIfUserExistsBySub(sub))) {
      throw new Error(
        "User does not exist. First create a user and then update user settings."
      );
    }

    const downloadedUser = (await getUserDataBySub(sub, [
      "name",
      "profilePic",
      "state",
    ])) as unknown as UserData;

    const securedUser = { ...downloadedUser, websiteSettings: settings };

    const result = await uploadUserToServer(securedUser, sub);

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
