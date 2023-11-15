"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const UserContext = createContext<
  | {
      user: UserData | null;
      setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    }
  | undefined
>(undefined);

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
