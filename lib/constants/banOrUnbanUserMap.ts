import type { UserState } from "@/src/features/account/model/types";
import BanUserIcon from "@/src/ui/icons/comment/BanUserIcon";
import UnbanUserIcon from "@/src/ui/icons/comment/UnbanUserIcon";

const userStateIconMap: Record<UserState, typeof BanUserIcon | null> = {
  normal: BanUserIcon,
  banned: UnbanUserIcon,
  admin: null,
};

export function getBanOrUnban(state: UserState) {
  return userStateIconMap[state];
}
