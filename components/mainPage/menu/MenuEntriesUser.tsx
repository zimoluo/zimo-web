"use client";

import { useUser } from "@/components/contexts/UserContext";
import GoogleSignInButton from "./GoogleSignInButton";
import MenuUserCard from "./MenuUserCard";

export default function MenuEntriesUser() {
  const { user } = useUser();

  return user === null ? <GoogleSignInButton /> : <MenuUserCard />;
}
