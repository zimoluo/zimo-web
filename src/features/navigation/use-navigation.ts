"use client";
import { usePathname } from "next/navigation";
import { routeKey } from "../../lib/navigation";
export function useNavigation() { return routeKey(usePathname()); }
