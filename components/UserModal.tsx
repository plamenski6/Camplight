"use client";

import { User } from "@/types";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

interface Props {
  show: boolean;
  total: number;
  setShow: Dispatch<SetStateAction<boolean>>;
  getUsers: (
    skip: number,
    credentials?: {
      id: number;
      name: string;
      email: string;
      phone: string;
    }
  ) => Promise<void>;
}

export default function UserModal({ show, total, setShow, getUsers }: Props) {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
      setIsLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/users/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: credentials.name.split(" ")[0],
            lastName: credentials.name.split(" ")[1],
            email: credentials.email,
            phone: credentials.phone,
          }),
        });
        const result: User = await response.json();
        if (result.id) {
          toast.success("Successfully created user");
          getUsers(total - (total % 10), { ...credentials, id: result.id });
          setShow(false);
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
        <Modal.Title>Add user</Modal.Title>
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
              pattern="^\+?[\d]{8,}$"
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
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
