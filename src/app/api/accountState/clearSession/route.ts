export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": `session_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
        0
      ).toUTCString()}`,
    },
  });
}
