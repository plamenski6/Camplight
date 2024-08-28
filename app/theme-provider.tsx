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
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
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
  const [search, setSearch] = useState("");

  return (
    <>
      <ThemeContext.Provider
        value={{ contextUsers, setContextUsers, search, setSearch }}
      >
        {children}
      </ThemeContext.Provider>
      <ToastContainer />
    </>
  );
}
