"use client";

import { ThemeContext } from "@/app/theme-provider";
import { User, userCredentials } from "@/types";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

interface Props {
  edit?: boolean;
  show: boolean;
  total?: number;
  setShow: Dispatch<SetStateAction<boolean>>;
  getUsers?: (skip: number, credentials?: userCredentials) => Promise<void>;
  editUserCredentials?: userCredentials;
}

export default function UserModal({
  edit,
  show,
  total,
  setShow,
  getUsers,
  editUserCredentials,
}: Props) {
  const { contextUsers, setSearch } = useContext(ThemeContext);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (edit) {
      setCredentials({
        name: editUserCredentials?.name,
        email: editUserCredentials?.email,
        phone: editUserCredentials?.phone,
      } as userCredentials);
    }
  }, [edit, editUserCredentials]);

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity()) {
      const userIndex = contextUsers?.findIndex(
        (user) => editUserCredentials && user.id === editUserCredentials.id
      );

      const body = {
        firstName: credentials.name.split(" ")[0],
        lastName: credentials.name.split(" ")[1],
        email: credentials.email,
        phone: credentials.phone,
      };

      if (editUserCredentials && editUserCredentials.id === 209) {
        userIndex &&
          editUserCredentials &&
          contextUsers?.splice(userIndex, 1, {
            id: editUserCredentials.id,
            ...body,
            isDeleted: false,
          });
        setShow(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://dummyjson.com/users/${
            edit ? editUserCredentials && editUserCredentials.id : "add"
          }`,
          {
            method: edit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        const result: User = await response.json();
        if (result.id) {
          toast.success(`Successfully ${edit ? "edited" : "created"} user`);
          if (edit) {
            userIndex &&
              editUserCredentials &&
              contextUsers?.splice(userIndex, 1, {
                id: editUserCredentials.id,
                ...body,
                isDeleted: false,
              });
          } else {
            setSearch("");
            getUsers &&
              total &&
              getUsers(total - (total % 10), { ...credentials, id: result.id });
          }
          setCredentials({
            name: "",
            email: "",
            phone: "",
          });
          setValidated(false);
          setIsLoading(false);
          setShow(false);
          return;
        } else {
          toast.error("Failed to create user");
        }
      } catch (err) {
        toast.error("Failed to create user");
      }
      setIsLoading(false);
    }
    setValidated(true);
  };

  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        setCredentials({
          name: "",
          email: "",
          phone: "",
        });
        setValidated(false);
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{edit ? "Edit" : "Add"} user</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={submitHandler}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="My Name"
              value={credentials.name}
              onChange={inputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="name@example.com"
              value={credentials.email}
              onChange={inputChange}
              pattern="^[a-zA-Z0-9._\-%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter a valid email
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              type="text"
              placeholder="+359XXXXXXXXX"
              value={credentials.phone}
              onChange={inputChange}
              pattern="^\+?[\d\- ]{8,}$"
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter a valid phone number
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setCredentials({
                name: "",
                email: "",
                phone: "",
              });
              setValidated(false);
              setShow(false);
            }}
          >
            Close
          </Button>
          <Button type="submit" variant="success" disabled={isLoading}>
            {edit ? "Edit" : "Add"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
