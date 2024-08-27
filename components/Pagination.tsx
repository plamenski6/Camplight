"use client";

import { ThemeContext } from "@/app/theme-provider";
import { Result, User } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Button, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import UserModal from "./UserModal";

interface Props {
  total: number;
}

export default function CustomPagination({ total }: Props) {
  const { contextUsers, setContextUsers } = useContext(ThemeContext);
  const [initialLoad, setInitialLoad] = useState(true);
  const [users, setUsers] = useState<User[]>();
  const [show, setShow] = useState(false);

  const getUsers = async (
    skip: number,
    credentials?: {
      id: number;
      name: string;
      email: string;
      phone: string;
    }
  ) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=10&skip=${skip}`
      );
      const result: Result = await response.json();
      const deletedUsers = JSON.parse(
        localStorage.getItem("deletedUsers") as string
      );
      let updatedUsers = result.users.filter(
        (user) => !deletedUsers?.includes(user.id)
      );
      if (updatedUsers.length < 10) {
        const response = await fetch(
          `https://dummyjson.com/users?limit=${10 - updatedUsers.length}&skip=${
            updatedUsers[updatedUsers.length - 1].id
          }`
        );
        const result: Result = await response.json();
        updatedUsers = updatedUsers.concat(result.users);
        credentials &&
          updatedUsers.push({
            ...credentials,
            isDeleted: false,
            firstName: credentials.name.split(" ")[0],
            lastName: credentials.name.split(" ")[1],
          });
      }
      setContextUsers(updatedUsers);
      setUsers(updatedUsers);
    } catch (err) {
      toast.error("Unable to fetch users");
    }
  };

  useEffect(() => {
    if (initialLoad) localStorage.removeItem("deletedUsers");
    getUsers(0);
    setInitialLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-100 d-flex justify-content-between align-items-start mt-4">
        <Button
          variant="light"
          className="bg-white"
          onClick={() => {
            setShow(true);
          }}
        >
          Add user
        </Button>

        <Pagination>
          <Pagination.First
            linkClassName="link-dark"
            onClick={() => getUsers(0)}
            disabled={initialLoad || (users && users[0].id === 1)}
          />
          <Pagination.Prev
            linkClassName="link-dark"
            onClick={() => getUsers(contextUsers[0].id - 11)}
            disabled={initialLoad || (users && users[0].id === 1)}
          />
          {/* <Pagination.Item linkClassName="link-dark">{1}</Pagination.Item>
            <Pagination.Ellipsis linkClassName="link-dark" />
            <Pagination.Item linkClassName="link-dark">{10}</Pagination.Item>
            <Pagination.Item linkClassName="link-dark">{11}</Pagination.Item>
            <Pagination.Item linkClassName="link-dark">{12}</Pagination.Item>
            <Pagination.Item linkClassName="link-dark">{13}</Pagination.Item>
            <Pagination.Item linkClassName="link-dark">{14}</Pagination.Item>
            <Pagination.Ellipsis linkClassName="link-dark" />
            <Pagination.Item linkClassName="link-dark">{20}</Pagination.Item> */}
          <Pagination.Next
            linkClassName="link-dark"
            onClick={() => getUsers(contextUsers[contextUsers?.length - 1].id)}
            disabled={
              initialLoad || (users && users[users.length - 1].id === total)
            }
          />
          <Pagination.Last
            linkClassName="link-dark"
            onClick={() => getUsers(total - (total % 10))}
            disabled={
              initialLoad || (users && users[users.length - 1].id === total)
            }
          />
        </Pagination>
      </div>

      <UserModal
        show={show}
        total={total}
        setShow={setShow}
        getUsers={getUsers}
      />
    </>
  );
}
