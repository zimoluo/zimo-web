import {
  ChangeEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { baseUrl, getNavigation } from "./constants/navigationFinder";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useUser } from "@/components/contexts/UserContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { evaluateAuthCode } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useToast } from "@/components/contexts/ToastContext";

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

export const useSwipe = ({
  left,
  right,
  up,
  down,
  subjectRef,
  respectDisableGesturesSetting = true,
  allowMouse = true,
}: {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
  subjectRef?: RefObject<any>;
  respectDisableGesturesSetting?: boolean;
  allowMouse?: boolean;
}) => {
  const { settings } = useSettings();
  const touchCoordsRef = useRef({ x: 0, y: 0, time: Date.now() });
  const fnsRef = useRef({ up, down, left, right });
  fnsRef.current = {
    up,
    left,
    down,
    right,
  };

  const handleStart = useCallback((e: TouchEvent | MouseEvent) => {
    const { clientX, clientY } = "clientX" in e ? e : e.targetTouches[0];
    touchCoordsRef.current = { x: clientX, y: clientY, time: Date.now() };
  }, []);

  const handleEnd = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (settings.disableGestures && respectDisableGesturesSetting) return;
      if (!allowMouse && "clientX" in e) return;

      const { clientX: touchEndX, clientY: touchEndY } =
        "clientX" in e ? e : e.changedTouches[0];
      const {
        x: touchStartX,
        y: touchStartY,
        time: touchStartTime,
      } = touchCoordsRef.current;
      const elapsedTime = (Date.now() - touchStartTime) / 1000;
      const threshold = 40; // px
      const swipeTimeThreshold = 2.5; // sec

      if (elapsedTime > swipeTimeThreshold) return;

      const xDistance = touchStartX - touchEndX;
      const yDistance = touchStartY - touchEndY;

      if (Math.abs(xDistance) < threshold && Math.abs(yDistance) < threshold)
        return;

      if (Math.abs(xDistance) >= Math.abs(yDistance)) {
        xDistance > 0 ? fnsRef.current.right?.() : fnsRef.current.left?.();
      } else {
        yDistance > 0 ? fnsRef.current.down?.() : fnsRef.current.up?.();
      }
    },
    [settings, respectDisableGesturesSetting]
  );

  useEffect(() => {
    const subject = subjectRef?.current;
    if (!subject) return;

    subject.addEventListener("touchstart", handleStart, { passive: true });
    subject.addEventListener("touchend", handleEnd, { passive: true });
    subject.addEventListener("mousedown", handleStart, { passive: true });
    subject.addEventListener("mouseup", handleEnd, { passive: true });

    return () => {
      subject.removeEventListener("touchstart", handleStart);
      subject.removeEventListener("touchend", handleEnd);
      subject.removeEventListener("mousedown", handleStart);
      subject.removeEventListener("mouseup", handleEnd);
    };
  }, [subjectRef, handleStart, handleEnd]);
};

export function useNextRenderEffect(callback: () => void, dependencies: any[]) {
  const [hasExecuted, setHasExecuted] = useState(true);

  useEffect(() => {
    if (hasExecuted) {
      return;
    }

    callback();
    setHasExecuted(true);
  }, [hasExecuted, callback, ...dependencies]);

  return () => {
    setHasExecuted(false);
  };
}

export function useClientSideFlag(checkFunction: () => boolean): boolean {
  const status = useClientSideLogic<boolean>(checkFunction, false);
  return status ?? false;
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

export default function useSiteGoogleLogin(
  onError:
    | ((
        errorResponse: Pick<
          CodeResponse,
          "error" | "error_description" | "error_uri"
        >
      ) => void)
    | undefined = () => {}
) {
  const { setUser } = useUser();
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const validateCode = async (codeResponse: any) => {
    const codeAuth = codeResponse.code;
    const userData = await evaluateAuthCode(codeAuth, settings, "google");
    if (userData === null) {
      return;
    }
    setUser(userData);
    if (userData.websiteSettings !== null) {
      updateSettings(userData.websiteSettings, false);
    }

    appendToast({
      title: "Zimo Web",
      description: `Signed in as ${userData.name}.`,
    });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      validateCode(codeResponse);
    },
    flow: "auth-code",
    onError: onError,
  });

  return { login };
}

export function useAppleSignIn() {
  const { setUser } = useUser();
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redirectURI = window.location.origin;
  const scope = "name";
  const clientId =
    process.env.NEXT_PUBLIC_ZIMO_WEB_APPLE_SIGN_IN_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).AppleID) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    s.async = true;
    s.onload = () => {
      (window as any).AppleID.auth.init({
        clientId,
        scope,
        redirectURI,
        usePopup: true,
      });
      setReady(true);
    };
    s.onerror = () => setError(new Error("Failed to load Apple JS SDK"));
    document.head.appendChild(s);
  }, [clientId, redirectURI, scope]);

  const initiateSignIn = useCallback(async () => {
    setError(null);
    if (!(window as any).AppleID) {
      setError(new Error("AppleID SDK not loaded"));
      return null;
    }
    setLoading(true);
    try {
      const res: AppleAuthResponse = await (
        window as any
      ).AppleID.auth.signIn();
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err);
      return null;
    }
  }, []);

  const signIn = useCallback(async () => {
    const res = await initiateSignIn();
    if (res && res.authorization && res.authorization.code) {
      const userData = await evaluateAuthCode(
        res.authorization.code,
        settings,
        "apple"
      );
      if (userData === null) {
        return;
      }
      setUser(userData);
      if (userData.websiteSettings !== null) {
        updateSettings(userData.websiteSettings, false);
      }

      appendToast({
        title: "Zimo Web",
        description: `Signed in as ${userData.name}.`,
      });
    }
  }, [initiateSignIn, settings, setUser, updateSettings, appendToast]);

  return { ready, loading, error, signIn };
}

export function useInputParser<T>({
  value,
  setValue,
  isValid,
  formatValue,
  forceTrim = true,
}: InputParserData<T> & { forceTrim?: boolean }): [
  string,
  (event: ChangeEvent<HTMLInputElement>) => void
] {
  const [storedValue, setStoredValue] = useState<string>(
    `${formatValue(`${value}`)}`
  );

  const [cachedValue, setCachedValue] = useState<string>(
    `${formatValue(`${value}`)}`
  );

  const handleChange = (event: ChangeEvent<any>) => {
    let eventValue = event.target.value;
    if (forceTrim) {
      eventValue = eventValue.trim();
    }

    setStoredValue(eventValue);

    if (!isValid(eventValue)) {
      return;
    }

    const formattedValue = formatValue(eventValue);
    setValue(formattedValue);
  };

  useEffect(() => {
    if (`${formatValue(`${value}`)}` === `${formatValue(`${cachedValue}`)}`) {
      return;
    }

    setCachedValue(`${formatValue(`${value}`)}`);
    setStoredValue(`${formatValue(`${value}`)}`);
  }, [value, formatValue, cachedValue]);

  return [storedValue, handleChange];
}

export const useDragAndTouch = ({
  onMove = null,
  onFinish = () => {},
  onStart = () => {},
  dependencies = [],
  isDisabled = false,
}: {
  onMove?: ((event: MouseEvent | TouchEvent) => void) | null;
  onFinish?: ((event: MouseEvent | TouchEvent) => void) | (() => void);
  onStart?:
    | ((event: React.MouseEvent | React.TouchEvent) => void)
    | (() => void);
  dependencies?: any[];
  isDisabled?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const handleStartDragging = (event: React.MouseEvent) => {
    event.preventDefault();
    onStart(event);
    setIsDragging(true);
  };

  const handleStartTouching = (event: React.TouchEvent) => {
    onStart(event);
    setIsTouching(true);
  };

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (onMove === null || (!isDragging && !isTouching)) {
        return;
      }

      onMove(event);
    },
    [isDragging, isTouching, onMove, ...dependencies]
  );

  const handleDragFinish = (event: MouseEvent) => {
    setIsDragging(false);

    if (!isTouching) {
      onFinish(event);
    }
  };

  const handleTouchFinish = (event: TouchEvent) => {
    setIsTouching(false);

    if (!isDragging) {
      onFinish(event);
    }
  };

  useEffect(() => {
    if (isDisabled) {
      setIsDragging(false);
      setIsTouching(false);
      return;
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleDragFinish);
    } else {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleDragFinish);
    }

    if (isTouching) {
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleTouchFinish);
    } else {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleTouchFinish);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleDragFinish);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleTouchFinish);
    };
  }, [isDragging, isTouching, handleMove, handleDragFinish, handleTouchFinish]);

  return { handleStartDragging, handleStartTouching };
};
