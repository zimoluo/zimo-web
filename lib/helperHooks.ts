import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavigation } from "./constants/navigationFinder";

export function useNavigation(): NavigationKey {
  const pathname = usePathname();
  const navigation = useMemo(() => {
    return getNavigation(pathname);
  }, [pathname]);

  return navigation;
}

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
