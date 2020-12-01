import React from "react";
import { Button } from "@patternfly/react-core";
import { Input } from "ui/formik";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { SelectWithSearch } from "ui/formik";
import { ITeam } from "types";

interface INewFeeder {
  name: string;
  team_id: string;
}

const CreateFeederSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Feeder name is too short!")
    .required("Feeder name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface CreateFeederFormProps {
  teams: ITeam[];
  onSubmit: (feeder: INewFeeder) => void;
}

export default function CreateFeederForm({
  teams,
  onSubmit,
}: CreateFeederFormProps) {
  return (
    <Formik
      initialValues={{ name: "", team_id: "" }}
      validationSchema={CreateFeederSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="create_feeder_form" className="pf-c-form">
          <Input
            id="create_feeder_form__name"
            data-testid="create_feeder_form__name"
            label="Name"
            name="name"
            isRequired
          />
          <SelectWithSearch
            id="create_feeder_form__team_id"
            placeholder="Select a team"
            name="team_id"
            options={teams.map((t) => ({ label: t.name, value: t.id }))}
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Create a feeder
          </Button>
        </Form>
      )}
    </Formik>
  );
}
