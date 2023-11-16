import BanUserIcon from "@/components/images/comment/BanUserIcon";
import UnbanUserIcon from "@/components/images/comment/UnbanUserIcon";

const userStateIconMap: Record<UserState, typeof BanUserIcon | null> = {
  normal: BanUserIcon,
  banned: UnbanUserIcon,
  admin: null,
};

export function getBanOrUnban(state: UserState) {
  return userStateIconMap[state];
}
