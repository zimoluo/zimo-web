import type { UserState } from "../model/types";
import type { ReactNode } from "react";
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
    admin: <Image className={className} src="/util/user-state/admin.svg" width={100} height={100} alt="User is admin" />,
    banned: (
      <Image className={className} src="/util/user-state/banned.svg" width={100} height={100} alt="User is banned" />
    ),
  };

  return userStateMap[state];
}
