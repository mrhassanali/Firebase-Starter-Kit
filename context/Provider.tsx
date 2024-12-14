"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { StateProvider } from "./StateContext";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <StateProvider>{children}</StateProvider>
    </AuthProvider>
  );
};

export default Provider;
