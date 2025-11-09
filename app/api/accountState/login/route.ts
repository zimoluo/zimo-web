import {
  fetchDecodedAppleToken,
  fetchDecodedToken,
  getUserByPayload,
} from "@/lib/dataLayer/server/accountStateManager";
import { SignJWT } from "jose";

const createSessionToken = async (userSubData: string) => {
  const secretKey = process.env.ZIMO_WEB_JWT_KEY;

  if (!secretKey) {
    throw new Error("ZIMO_WEB_JWT_KEY is undefined!");
  }

  const token = await new SignJWT({ sub: userSubData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(new TextEncoder().encode(secretKey));

  return token;
};

export async function POST(request: Request) {
  try {
    const { codeAuth, localSettingsData, type } = await request.json();

    let decodedPayload: AccountPayloadData | null = null;

    if (type === "google") {
      decodedPayload = await fetchDecodedToken(codeAuth);
    } else if (type === "apple") {
      decodedPayload = await fetchDecodedAppleToken(codeAuth);
    } else {
      throw new Error("Unsupported authentication type.");
    }

    if (decodedPayload === null) {
      throw new Error("Invalid payload.");
    }

    const fetchedUser = await getUserByPayload(
      decodedPayload,
      localSettingsData
    );

    if (fetchedUser === null) {
      throw new Error("Failed to fetch user.");
    }

    const sessionToken = await createSessionToken(decodedPayload.sub);

    const cookieExpires = new Date(
      Date.now() + 180 * 24 * 60 * 60 * 1000
    ).toUTCString();

    return new Response(JSON.stringify(fetchedUser), {
      status: 200,
      headers: {
        "Set-Cookie": `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${cookieExpires}`,
      },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
