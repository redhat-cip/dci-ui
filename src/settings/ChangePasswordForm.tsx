import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ICurrentUser, ICurrentUserWithPasswordsFields } from "types";

const ChangePasswordSchema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string().required("New password is required"),
});

interface ChangePasswordFormProps {
  onSubmit: (user: ICurrentUserWithPasswordsFields) => void;
  currentUser: ICurrentUser;
}

export default function ChangePasswordForm({
  onSubmit,
  currentUser,
}: ChangePasswordFormProps) {
  if (!currentUser) return null;
  return (
    <Formik
      initialValues={{ ...currentUser, current_password: "", new_password: "" }}
      validationSchema={ChangePasswordSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="change_password_form" className="pf-v6-c-form">
          <Input
            id="change_password_form__current_password"
            data-testid="change_password_form__current_password"
            label="Current password"
            name="current_password"
            type="password"
            isRequired
          />
          <Input
            id="change_password_form__new_password"
            data-testid="change_password_form__new_password"
            label="New password"
            name="new_password"
            type="password"
            isRequired
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Change your password
          </Button>
        </Form>
      )}
    </Formik>
  );
}
