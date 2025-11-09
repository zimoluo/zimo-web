import {
  fetchDecodedToken,
  getUserByPayload,
} from "@/lib/dataLayer/server/accountStateManager";
import jwt from "jsonwebtoken";

const createSessionToken = (userSubData: string) => {
  const secretKey = process.env.ZIMO_WEB_JWT_KEY;

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is undefined!");
  }

  const token = jwt.sign({ sub: userSubData }, secretKey, {
    expiresIn: "180d",
  });

  return token;
};

export async function POST(request: Request) {
  const { codeAuth, localSettingsData } = await request.json();

  try {
    const decodedPayload = await fetchDecodedToken(codeAuth);

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

    const sessionToken = createSessionToken(decodedPayload.sub);

    return new Response(JSON.stringify(fetchedUser), {
      status: 200,
      headers: {
        "Set-Cookie": `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
          Date.now() + 180 * 60 * 24 * 60 * 1000 // 180 days
        ).toUTCString()}`,
      },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
