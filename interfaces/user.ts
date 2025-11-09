type UserInfo = AccountPayloadData & {
  state: UserState;
};

type UserData = UserInfo & {
  websiteSettings: SettingsState | null;
};

type UserState = "normal" | "admin" | "banned";

interface AccountPayloadData {
  name: string;
  profilePic: string | null;
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
