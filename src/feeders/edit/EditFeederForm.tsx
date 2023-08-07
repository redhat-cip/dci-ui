import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { SelectWithTypeahead } from "ui/formik";
import { ITeam, IFeeder } from "types";

const EditFeederSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Feeder name is too short!")
    .required("Feeder name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface EditFeederFormProps {
  feeder: IFeeder;
  teams: ITeam[];
  onSubmit: (feeder: IFeeder) => void;
}

export default function EditFeederForm({
  feeder,
  teams,
  onSubmit,
}: EditFeederFormProps) {
  return (
    <Formik
      initialValues={feeder}
      validationSchema={EditFeederSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="edit_feeder_form" className="pf-v5-c-form">
          <Input
            id="edit_feeder_form__name"
            data-testid="edit_feeder_form__name"
            label="Name"
            name="name"
            isRequired
          />
          <SelectWithTypeahead
            id="edit_feeder_form__team_id"
            placeholder="Select a team"
            name="team_id"
            options={teams.map((t) => ({ label: t.name, value: t.id }))}
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Edit a feeder
          </Button>
        </Form>
      )}
    </Formik>
  );
}
