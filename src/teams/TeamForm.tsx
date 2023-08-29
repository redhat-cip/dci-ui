import { forwardRef } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { Input, Checkbox, Select } from "ui/formik";
import { INewTeam, ITeam } from "types";

const TeamSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Team name is too short!")
    .required("Team name is required"),
  description: Yup.string(),
  state: Yup.string().required(),
  external: Yup.boolean(),
  has_pre_release_access: Yup.boolean(),
});

interface TeamFormProps {
  team?: ITeam;
  onSubmit: (team: INewTeam | ITeam) => void;
}

const TeamForm = forwardRef<FormikProps<INewTeam>, TeamFormProps>(
  ({ team, onSubmit }, formRef) => (
    <Formik
      innerRef={formRef}
      initialValues={
        team || {
          name: "",
          external: true,
          state: "active",
          has_pre_release_access: false,
        }
      }
      validationSchema={TeamSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form id="team_form" className="pf-v5-c-form">
          <Input
            id="team_form__name"
            data-testid="team_form__name"
            label="Name"
            name="name"
            isRequired
          />
          <Select
            id="team_form__state"
            label="State"
            name="state"
            placeholder="State"
            option={values.state}
            options={[
              {
                label: "active",
                value: "active",
              },
              {
                label: "inactive",
                value: "inactive",
              },
            ]}
          />
          <Checkbox
            id="team_form__external"
            data-testid="team_form__external"
            label="Partner"
            name="external"
          />
          <Checkbox
            id="team_form__has_pre_release_access"
            label="Pre release access"
            name="has_pre_release_access"
          />
        </Form>
      )}
    </Formik>
  ),
);

export default TeamForm;
