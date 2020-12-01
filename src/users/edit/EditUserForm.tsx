import React from "react";
import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IUser } from "types";

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
  user: IUser;
  onSubmit: (user: IUser) => void;
}

export default function CreateUserForm({
  user,
  onSubmit,
}: CreateUserFormProps) {
  return (
    <Formik
      initialValues={user}
      validationSchema={CreateUserSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="create_user_form" className="pf-c-form">
          <Input
            id="create_user_form__name"
            data-testid="create_user_form__name"
            label="Login"
            name="name"
            isRequired
          />
          <Input
            id="create_user_form__fullname"
            data-testid="create_user_form__fullname"
            label="Full name"
            name="fullname"
            isRequired
          />
          <Input
            id="create_user_form__email"
            data-testid="create_user_form__email"
            label="Email"
            name="email"
            type="email"
            isRequired
          />
          <Input
            id="create_user_form__password"
            data-testid="create_user_form__password"
            label="Password"
            name="password"
            type="password"
            isRequired
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Edit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
