"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase/clientApp";

function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setIsLoading(false);
        setIsUser(false);
        setUser(null);
        setIsAdmin(false);
      } else {
        firebaseUser.getIdTokenResult().then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.isAdmin);
        });
        setIsUser(true);
        setIsLoading(false);
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { isUser, isLoading, user, isAdmin };
}

export default useAuth;
