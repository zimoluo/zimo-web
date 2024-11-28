export async function evaluateGoogleAuthCode(
  codeAuth: string,
  localSettingsData: SettingsState
): Promise<UserData | null> {
  try {
    const response = await fetch("/api/accountState/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codeAuth, localSettingsData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function syncUpUserSettings(
  sub: string,
  settings: SettingsState | null
) {
  try {
    const response = await fetch("/api/accountState/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ settings, sub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Something went wrong while trying to sync up user settings."
      );
    }

    return data;
  } catch (error) {
    console.error("Error uploading user data:", error);
    return null;
  }
}

export async function restoreClientUser(localSettings: SettingsState): Promise<{
  integratedUser: UserData;
  downloadedSettings: SettingsState | null;
  exists: boolean;
} | null> {
  try {
    const response = await fetch("/api/accountState/restoreSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localSettings }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred");
    }

    const data = await response.json();

    if (!data.exists) {
      console.log("No user session found.");
      return { exists: false } as any;
    }

    console.log("Successfully restored user session.");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function clearSessionToken() {
  try {
    const response = await fetch("/api/accountState/clearSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error clearing session token:", error);
    return null;
  }
}

export async function deleteUserAccount(
  sub: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `/api/accountState/deleteUser?sub=${encodeURIComponent(sub)}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Successfully deleted the user file." };
    } else {
      return { success: false, message: data.error };
    }
  } catch (error: any) {
    return { success: false, message: `Client-side error: ${error.message}` };
  }
}

export async function fetchManuallyDownloadUserSettings(): Promise<SettingsState | null> {
  try {
    const response = await fetch(
      "/api/accountState/manuallyDownloadUserSettings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Failed to download user settings: ${error}`);
      return null;
    }

    const { downloadedSettings } = await response.json();
    return downloadedSettings || null;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}
