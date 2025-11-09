type UserData = AccountPayloadData & {
  state: UserState;
  websiteSettings: SettingsState | null;
};

type UserInfo = AccountPayloadData & {
  name: string;
  profilePic: string;
  state: UserState;
};

type UserState = "normal" | "admin" | "banned";

interface AccountPayloadData {
  name: string;
  profilePic: string;
  sub: string;
}

type AppleAuthResponse = {
  authorization: {
    code?: string;
    id_token?: string;
    state?: string;
  };
  user?: { name?: { firstName?: string; lastName?: string } };
};
