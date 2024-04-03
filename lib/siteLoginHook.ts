import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useUser } from "@/components/contexts/UserContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { evaluateGoogleAuthCode } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useToast } from "@/components/contexts/ToastContext";

export default function useSiteLogin(
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
    const userData = await evaluateGoogleAuthCode(codeAuth, settings);
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
