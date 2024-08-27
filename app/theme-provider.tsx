"use client";

import { User } from "@/types";
import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { ToastContainer } from "react-toastify";

interface ContextObject {
  contextUsers: User[] | undefined;
  setContextUsers: Dispatch<SetStateAction<User[] | undefined>>;
}

export const ThemeContext: Context<ContextObject> = createContext(
  {} as ContextObject
);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contextUsers, setContextUsers] = useState<User[]>();
  return (
    <>
      <ThemeContext.Provider value={{ contextUsers, setContextUsers }}>
        {children}
      </ThemeContext.Provider>
      <ToastContainer />
    </>
  );
}
