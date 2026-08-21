import type { SettingsState } from "../../settings/model/types";
export type UserInfo = AccountPayloadData & {
  state: UserState;
};

export type UserData = UserInfo & {
  websiteSettings: SettingsState | null;
};

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
