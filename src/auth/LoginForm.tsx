import { Form, Formik } from "formik";
import { Input } from "ui/formik";
import { Button } from "@patternfly/react-core";
import * as Yup from "yup";
import { setBasicToken } from "services/localStorage";
import { hideAllAlerts, showError } from "alerts/alertsSlice";
import { useNavigate, useLocation } from "react-router";
import { useAppDispatch } from "store";

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
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LogInSchema}
      onSubmit={(values) => {
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
      }}
    >
      <Form className="pf-v6-c-form">
        <Input id="username" label="Username" name="username" isRequired />
        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          isRequired
        />
        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>
    </Formik>
  );
}
