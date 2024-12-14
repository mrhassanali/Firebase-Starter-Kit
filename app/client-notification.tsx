"use client";
import AuthContext from "@/context/AuthContext";
import { useFCM } from "@/hooks/useFCM";
import React, { useContext, useEffect } from "react";

const ClientNotification = ({ children }: { children: React.ReactNode }) => {
  const { loadToken } = useFCM();
  const { isUser } = useContext(AuthContext);

  // Getting FCM token
  useEffect(() => {
    if ("Notification" in window && isUser) {
      loadToken();
    }
  }, [isUser]);
  return <>{children}</>;
};

export default ClientNotification;
