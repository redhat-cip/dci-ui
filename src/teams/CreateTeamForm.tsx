import { Input, Checkbox } from "ui/formik";
import * as Yup from "yup";

export const CreateTeamFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Team name is too short!")
    .required("Team name is required"),
  external: Yup.boolean(),
});

export interface CreateTeamFormValues {
  name: string;
  external: boolean;
}

export default function CreateTeamForm() {
  return (
    <>
      <Input id="create_team_form__name" label="Name" name="name" isRequired />
      <Checkbox
        id="create_team_form__external"
        label="Partner"
        name="external"
        className="pf-u-mt-md"
      />
    </>
  );
}
