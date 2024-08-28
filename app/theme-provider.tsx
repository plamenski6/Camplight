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
  research: boolean;
  setResearch: Dispatch<SetStateAction<boolean>>;
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
  const [research, setResearch] = useState(false);

  return (
    <>
      <ThemeContext.Provider
        value={{
          contextUsers,
          setContextUsers,
          search,
          setSearch,
          research,
          setResearch,
        }}
      >
        {children}
      </ThemeContext.Provider>
      <ToastContainer />
    </>
  );
}
