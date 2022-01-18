import { Form, Formik } from "formik";
import { Input } from "ui/formik";
import { Button } from "@patternfly/react-core";
import * as Yup from "yup";
import { setBasicToken } from "services/localStorage";
import { showError } from "alerts/alertsActions";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";
import { AppDispatch } from "store";

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
  const { refreshIdentity } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LogInSchema}
      onSubmit={(values) => {
        const token = window.btoa(values.username.concat(":", values.password));
        setBasicToken(token);
        refreshIdentity()
          .then(() => {
            const { from } = (location.state as ILocationState) || {
              from: { pathname: "/jobs" },
            };
            navigate(from);
          })
          .catch((error) => {
            if (error.response && error.response.status) {
              dispatch(showError("Invalid username or password"));
            } else {
              dispatch(
                showError(
                  "Network error, check your connectivity or contact a DCI administrator"
                )
              );
            }
          });
      }}
    >
      <Form className="pf-c-form">
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
