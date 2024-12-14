"use client";

import React, { createContext, FC, ReactNode, useState } from "react";

interface StateContextValue {
  data: { [key: string]: any }[];
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: any }[]>>;
  isBackdrop: boolean;
  setIsBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: StateContextValue = {
  data: [],
  setData: () => {},
  isBackdrop: false,
  setIsBackdrop: () => {},
};
const StateContext = createContext<StateContextValue>(initialState);

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: FC<StateProviderProps> = ({ children }) => {
  const [data, setData] = useState<{ [key: string]: any }[]>([]);
  const [isBackdrop, setIsBackdrop] = useState<boolean>(false);

  return (
    <StateContext.Provider
      value={{
        data,
        setData,
        isBackdrop,
        setIsBackdrop,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;