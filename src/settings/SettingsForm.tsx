import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ICurrentUser } from "types";

const SettingsSchema = Yup.object().shape({
  email: Yup.string().email().required("An email is required"),
  fullname: Yup.string().required("Full name is required"),
  current_password: Yup.string().required("Current password is required"),
});

type currentUserWithPasswordFields = ICurrentUser & {
  current_password: string;
};

interface SettingsFormProps {
  onSubmit: (user: currentUserWithPasswordFields) => void;
  currentUser: ICurrentUser;
}

export default function SettingsForm({
  onSubmit,
  currentUser,
}: SettingsFormProps) {
  if (!currentUser) return null;
  return (
    <Formik
      initialValues={{ ...currentUser, current_password: "" }}
      validationSchema={SettingsSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="settings_form" className="pf-v5-c-form">
          <Input
            id="settings_form__email"
            data-testid="settings_form__email"
            label="Email"
            name="email"
            type="email"
            isRequired
          />
          <Input
            id="settings_form__fullname"
            data-testid="settings_form__fullname"
            label="Full name"
            name="fullname"
            isRequired
          />
          <Input
            id="settings_form__current_password"
            data-testid="settings_form__current_password"
            label="Current password"
            name="current_password"
            type="password"
            isRequired
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Update your settings
          </Button>
        </Form>
      )}
    </Formik>
  );
}
