import { NextResponse, type NextRequest } from "next/server";
import { routeKey } from "./features/theme/model/preferences";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-zimo-route", routeKey(request.nextUrl.pathname));
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
