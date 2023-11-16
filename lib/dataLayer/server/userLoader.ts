import { cache } from "react";
import { getUserDataBySub } from "./accountStateManager";

export const revalidate = 3600;

export const getCommentUserData = cache(
  async (sub: string): Promise<UserInfo> => {
    return (await getUserDataBySub(sub, [
      "name",
      "state",
      "profilePic",
    ])) as UserInfo;
  }
);
