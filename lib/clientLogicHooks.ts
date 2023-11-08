import { useEffect, useState } from "react";

export function useClientSideFlag(checkFunction: () => boolean): boolean {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(checkFunction());
  }, [checkFunction]);

  return status;
}

export function useClientSideLogic<T>(
  checkFunction: () => T,
  defaultValue: T | null = null
): T | null {
  const [status, setStatus] = useState<T | null>(defaultValue);

  useEffect(() => {
    setStatus(checkFunction());
  }, [checkFunction]);

  return status;
}
