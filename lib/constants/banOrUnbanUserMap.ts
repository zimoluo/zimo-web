import BanUserIcon from "@/components/assets/comment/BanUserIcon";
import UnbanUserIcon from "@/components/assets/comment/UnbanUserIcon";

const userStateIconMap: Record<UserState, typeof BanUserIcon | null> = {
  normal: BanUserIcon,
  banned: UnbanUserIcon,
  admin: null,
};

export function getBanOrUnban(state: UserState) {
  return userStateIconMap[state];
}
