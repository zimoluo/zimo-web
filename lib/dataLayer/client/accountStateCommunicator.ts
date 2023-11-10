export async function evaluateGoogleAuthCode(
  codeAuth: string,
  localSettingsData: SettingsState
): Promise<UserData | null> {
  try {
    // Send POST request to the API endpoint with idToken in the request body
    const response = await fetch("/api/accountState/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codeAuth, localSettingsData }),
    });

    // If the response status is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred");
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error: display it or log it
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
