import * as Yup from "yup";
import { useFormik } from "formik";
import { IUser } from "types";
import { InputGroup } from "ui/form";
import { Form } from "@patternfly/react-core";

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

interface UserFormProps {
  id: string;
  user?: IUser;
  onSubmit: (user: IUser | Partial<IUser>) => void;
}

function UserForm({ id, user, onSubmit }: UserFormProps) {
  const formik = useFormik({
    initialValues: user || { name: "", fullname: "", email: "", password: "" },
    validationSchema: CreateUserSchema,
    onSubmit: (values) => onSubmit(values as IUser),
  });

  type FormField = "name" | "fullname" | "email" | "password";

  function isNotValid(key: FormField) {
    return formik.touched[key] && Boolean(formik.errors[key]);
  }

  function getErrorMessage(key: FormField) {
    return (formik.touched[key] && formik.errors[key]) || "";
  }

  return (
    <Form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <InputGroup
        id="user-form-name"
        name="name"
        label="Login"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("name")}
        errorMessage={getErrorMessage("name")}
      />
      <InputGroup
        id="user-form-fullname"
        name="fullname"
        label="Full name"
        value={formik.values.fullname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("fullname")}
        errorMessage={getErrorMessage("fullname")}
      />
      <InputGroup
        id="user-form-email"
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("email")}
        errorMessage={getErrorMessage("email")}
      />
      <InputGroup
        data-testid="user-form-password"
        id="user-form-password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("password")}
        errorMessage={getErrorMessage("password")}
      />
    </Form>
  );
}

export default UserForm;
