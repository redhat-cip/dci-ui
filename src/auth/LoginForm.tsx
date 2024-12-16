import * as Yup from "yup";
import { setBasicToken } from "services/localStorage";
import { hideAllAlerts, showError } from "alerts/alertsSlice";
import { useNavigate, useLocation } from "react-router";
import { useAppDispatch } from "store";
import { FormProvider, useForm } from "react-hook-form";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form } from "@patternfly/react-core";

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Your username is too short!")
    .required("You username is required"),
  password: Yup.string().required("Your password is required"),
});

interface ILocationState {
  from: {
    pathname: string;
  };
}

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm({
    resolver: yupResolver(LogInSchema),
    defaultValues: { username: "", password: "" },
  });
  return (
    <FormProvider {...methods}>
      <Form
        id="login-form"
        onSubmit={methods.handleSubmit((values) => {
          try {
            const token = window.btoa(
              values.username.concat(":", values.password),
            );
            setBasicToken(token);
            dispatch(hideAllAlerts());
            const { from } = (location.state as ILocationState) || {
              from: { pathname: "/" },
            };
            navigate(from);
          } catch (error) {
            dispatch(showError("Invalid email or password"));
            console.error(error);
          }
        })}
      >
        <TextInputFormGroup
          id="username"
          label="Username"
          name="username"
          isRequired
        />
        <TextInputFormGroup
          id="password"
          label="Password"
          name="password"
          type="password"
          isRequired
        />
        <Button variant="primary" type="submit" form="login-form">
          Log in
        </Button>
      </Form>
    </FormProvider>
  );
}
