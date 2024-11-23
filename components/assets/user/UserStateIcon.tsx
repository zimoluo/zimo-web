import { ReactNode } from "react";
import adminSrc from "@/public/util/user-state/admin.svg";
import bannedSrc from "@/public/util/user-state/banned.svg";
import Image from "next/image";

interface Props {
  className?: string;
  state?: Exclude<UserState, "normal">;
}

export default function UserStateIcon({
  className = "",
  state = "banned",
}: Props) {
  const userStateMap: Record<Exclude<UserState, "normal">, ReactNode> = {
    admin: <Image className={className} src={adminSrc} alt="User is admin" />,
    banned: (
      <Image className={className} src={bannedSrc} alt="User is banned" />
    ),
  };

  return userStateMap[state];
}
