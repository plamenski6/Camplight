"use client";

import { ThemeContext } from "@/app/theme-provider";
import { Result, User } from "@/types";
import { useContext, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import UserModal from "./UserModal";

interface Props {
  users: User[];
}

export default function CustomTable({ users }: Props) {
  const { contextUsers, setContextUsers } = useContext(ThemeContext);
  const [editUserCredentials, setEditUserCredentials] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
  });
  const [show, setShow] = useState(false);
  const mappedUsers = !contextUsers ? users : contextUsers;

  const deleteUser = async (id: number) => {
    if (id === 209) {
      let updatedUsers = mappedUsers.filter((user) => user.id !== id);
      setContextUsers(updatedUsers);
      return;
    }

    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`, {
        method: "DELETE",
      });
      const result: User = await response.json();
      if (result.isDeleted) {
        if (localStorage.getItem("deletedUsers")) {
          const deletedUsers = JSON.parse(
            localStorage.getItem("deletedUsers") as string
          );
          deletedUsers.push(result.id);
          localStorage.setItem("deletedUsers", JSON.stringify(deletedUsers));
        } else {
          localStorage.setItem("deletedUsers", JSON.stringify([result.id]));
        }
        let updatedUsers = mappedUsers.filter((user) => user.id !== id);
        if (updatedUsers.length < 10) {
          const response = await fetch(
            `https://dummyjson.com/users?limit=${
              10 - updatedUsers.length
            }&skip=${updatedUsers[updatedUsers.length - 1].id}`
          );
          const result: Result = await response.json();
          updatedUsers = updatedUsers.concat(result.users);
        }
        setContextUsers(updatedUsers);
        toast.error("Successfully deleted user");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <Table striped hover responsive className="mb-0">
        <thead>
          <tr>
            <th className="d-flex border-0">
              <span className="material-icons">person</span>
            </th>
            <th className="border-0">Name</th>
            <th className="border-0">Email</th>
            <th className="border-0">Phone</th>
            <th className="border-0">Action</th>
          </tr>
        </thead>
        <tbody>
          {mappedUsers.map((user) => (
            <tr key={user.id}>
              <td className="text-center border-0">{user.id}</td>
              <td className="border-0">
                {user.firstName} {user.lastName}
              </td>
              <td className="border-0">
                <a className="link-warning" href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              </td>
              <td className="border-0">
                <a className="link-danger" href={`tel:${user.phone}`}>
                  {user.phone}
                </a>
              </td>
              <td className="d-flex justify-content-center border-0">
                <span
                  title={`Edit ${user.firstName} ${user.lastName}`}
                  role="button"
                  className="link-warning material-icons"
                  onClick={() => {
                    setEditUserCredentials({
                      id: user.id,
                      name: `${user.firstName}${
                        user.lastName ? ` ${user.lastName}` : ""
                      }`,
                      email: user.email,
                      phone: user.phone,
                    });
                    setShow(true);
                  }}
                >
                  edit
                </span>
                <span
                  title={`Delete ${user.firstName} ${user.lastName}`}
                  role="button"
                  className="link-danger material-icons"
                  onClick={() => deleteUser(user.id)}
                >
                  delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserModal
        edit
        show={show}
        setShow={setShow}
        editUserCredentials={editUserCredentials}
      />
    </>
  );
}
