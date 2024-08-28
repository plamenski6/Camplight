"use client";

import { useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "@/styles/page.module.scss";
import { toast } from "react-toastify";
import { Result, User } from "@/types";
import { ThemeContext } from "@/app/theme-provider";

export default function SearchBar() {
  const { setContextUsers, search, setSearch, research } =
    useContext(ThemeContext);

  const searchHandler = async (clear?: boolean) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/users${
          !clear ? `/search?q=${search.trim()}` : ""
        }`
      );
      const result: Result = await response.json();
      if (result.users.length > 0) {
        const deletedUsers = JSON.parse(
          localStorage.getItem("deletedUsers") as string
        );

        let searchedUsers: User[] = [];

        if (deletedUsers) {
          searchedUsers = result.users.filter(
            (user) => !deletedUsers.includes(user.id)
          );
        } else {
          searchedUsers = result.users;
        }

        if (searchedUsers.length === 0) {
          toast.error("Couldn't find users");
        } else {
          const editedUsers: User[] = JSON.parse(
            localStorage.getItem("editedUsers") as string
          );
          let updatedUsers = clear
            ? result.users.splice(0, 10)
            : searchedUsers.length > 10
            ? searchedUsers.splice(0, 10)
            : searchedUsers;
          if (editedUsers) {
            const editedIds = editedUsers.map((editedUser) => editedUser.id);
            updatedUsers = updatedUsers.map((user) => {
              if (editedIds.includes(user.id)) {
                return editedUsers.find(
                  (editedUser) => editedUser.id === user.id
                );
              } else {
                return user;
              }
            }) as User[];
          }
          setContextUsers(updatedUsers);
        }
      } else {
        toast.error("Couldn't find users");
      }
    } catch (err) {
      toast.error("Couldn't find users");
    }
  };

  useEffect(() => {
    if (research) searchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [research]);

  return (
    <div className="mb-3 d-flex">
      <Form.Control
        className={styles.search}
        type="text"
        placeholder="Search by Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        pattern="^[a-zA-Z0-9._\-%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        required
      />

      <Button
        variant="light"
        className="ms-2 bg-white"
        onClick={() => searchHandler()}
        disabled={!search.trim()}
      >
        Search
      </Button>
      <Button
        variant="light"
        className="ms-2 bg-white"
        onClick={() => {
          setSearch("");
          searchHandler(true);
          localStorage.removeItem("deletedUsers");
        }}
        disabled={!search.trim()}
      >
        Clear
      </Button>
    </div>
  );
}
