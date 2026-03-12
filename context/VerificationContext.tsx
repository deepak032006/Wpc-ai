"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ResetData = {
  email: string;
  token: string;
  code: string;
};

type VerificationContextType = {
  resetData: ResetData | null;
  setResetData: (data: ResetData) => void;
  clearResetData: () => void;
};

const VerificationContext = createContext<VerificationContextType | undefined>(
  undefined
);

export function VerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [resetData, setResetDataState] = useState<ResetData | null>(null);

  /* Load from sessionStorage */
  useEffect(() => {
    const stored = sessionStorage.getItem("resetData");
    if (stored) {
      setResetDataState(JSON.parse(stored));
    }
  }, []);

  const setResetData = (data: ResetData) => {
    setResetDataState(data);

    sessionStorage.setItem("resetData", JSON.stringify(data));
  };

  const clearResetData = () => {
    setResetDataState(null);
    sessionStorage.removeItem("resetData");
  };

  return (
    <VerificationContext.Provider
      value={{ resetData, setResetData, clearResetData }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function usePasswordReset() {
  const context = useContext(VerificationContext);

  if (!context) {
    throw new Error(
      "usePasswordReset must be used within VerificationProvider"
    );
  }

  return context;
}