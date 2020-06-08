import React from "react";
import Formsy from "formsy-react";
import { useLocation, useHistory } from "react-router-dom";
import { Input } from "ui/form";
import { Button } from "@patternfly/react-core";
import { useDispatch } from "react-redux";
import { useAuth } from "./authContext";
import { useSwitch } from "../hooks";
import { setBasicToken } from "services/localStorage";
import { showError } from "alerts/alertsActions";

const LoginForm = () => {
  const { refreshIdentity } = useAuth();
  const { isOn, on, off } = useSwitch();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  return (
    <Formsy
      className="pf-c-form"
      onValidSubmit={(user) => {
        const token = window.btoa(user.username.concat(":", user.password));
        setBasicToken(token);
        refreshIdentity()
          .then(() => {
            const { from } = location.state || { from: { pathname: "/jobs" } };
            history.replace(from);
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
      onValid={on}
      onInvalid={off}
    >
      <Input label="Username" name="username" required />
      <Input label="Password" name="password" type="password" required />
      <Button variant="primary" isDisabled={!isOn} type="submit">
        Log in
      </Button>
    </Formsy>
  );
};

export default LoginForm;
