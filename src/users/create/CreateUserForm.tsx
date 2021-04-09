import React from "react";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { INewUser } from "types";

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

const CreateUserForm = React.forwardRef<
  FormikProps<INewUser>,
  CreateUserFormProps
>(({ onSubmit }, formRef) => (
  <Formik
    innerRef={formRef}
    initialValues={{ name: "", fullname: "", email: "", password: "" }}
    validationSchema={CreateUserSchema}
    onSubmit={onSubmit}
  >
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
    </Form>
  </Formik>
));

export default CreateUserForm;
