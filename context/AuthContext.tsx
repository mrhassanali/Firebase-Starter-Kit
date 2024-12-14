"use client";

import React, { createContext, FC, ReactNode, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase/clientApp";

interface AuthContextValue {
  isUser: boolean;
  isLoading: boolean;
  user: User | null;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultAuthContextValue: AuthContextValue = {
  isUser: false,
  isLoading: false,
  user: null,
  isNewUser: false,
  setIsNewUser: () => {},
};
const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const router = useRouter();

  // track user credentials
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setIsUser(true);
        setUser(firebaseUser);
      } else {
        setIsUser(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isUser,
        isNewUser,
        setIsNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
