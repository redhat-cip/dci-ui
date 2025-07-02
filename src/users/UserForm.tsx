import * as Yup from "yup";
import type { IUser } from "types";
import { Form } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInputFormGroup from "ui/form/TextInputFormGroup";

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .required("User name is required")
    .min(2, "User name is too short!"),
  fullname: Yup.string()
    .required("Full name is required")
    .min(2, "Full name is too short!"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: Yup.string().required("User password is required"),
});

export default function UserForm({
  id,
  user,
  onSubmit,
  ...props
}: {
  id: string;
  user?: IUser;
  onSubmit: (user: IUser | Partial<IUser>) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: user || { name: "", fullname: "", email: "", password: "" },
  });
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <TextInputFormGroup
          id="user_form__name"
          name="name"
          label="Login"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__fullname"
          name="fullname"
          label="Full name"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__email"
          name="email"
          label="Email"
          type="email"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__password"
          name="password"
          label="Password"
          type="password"
          isRequired
        />
      </Form>
    </FormProvider>
  );
}
