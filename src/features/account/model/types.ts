export type UserState = "normal" | "admin" | "banned";

export interface AccountPayloadData {
  name: string;
  profilePic: string | null;
  sub: string;
}

export type AppleAuthResponse = {
  authorization: {
    code?: string;
    id_token?: string;
    state?: string;
  };
  user?: { name?: { firstName?: string; lastName?: string } };
};

export type AccountUser = Readonly<AccountPayloadData> & {
  readonly state: UserState;
  readonly websiteSettings: import("../../settings/model/settings").Settings | null;
  readonly syncedTheme?: import("../../theme/model/preferences").ThemePreferences | null | undefined;
  readonly syncedWorkspace?: import("../../workspace/model").WorkspaceData | null | undefined;
};
