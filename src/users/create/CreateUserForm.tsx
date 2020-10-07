import React from "react";
import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";

interface INewUser {
  name: string;
  fullname: string;
  email: string;
  password: string;
}

const CreateUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "User name is too short!")
    .required("User name is required"),
  fullname: Yup.string()
    .min(2, "Full name is too short!")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("User password is required"),
});

interface CreateUserFormProps {
  onSubmit: (user: INewUser) => void;
}

export default function CreateUserForm({ onSubmit }: CreateUserFormProps) {
  return (
    <Formik
      initialValues={{ name: "", fullname: "", email: "", password: "" }}
      validationSchema={CreateUserSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className="pf-c-form">
          <Input id="name" label="Login" name="name" isRequired />
          <Input id="fullname" label="Full name" name="fullname" isRequired />
          <Input id="email" label="Email" name="email" isRequired />
          <Input id="password" label="Password" name="password" isRequired />
          <Button variant="primary" type="submit" isDisabled={!(isValid && dirty)}>
            Create a user
          </Button>
        </Form>
      )}
    </Formik>
  );
}
