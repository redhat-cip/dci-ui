import * as Yup from "yup";
import { useFormik } from "formik";
import { ITeam } from "types";
import { CheckboxGroup, InputGroup, SelectGroup } from "ui/form";
import { Form } from "@patternfly/react-core";

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
  id: string;
  team?: ITeam;
  onSubmit: (team: Partial<ITeam>) => void;
}

function TeamForm({ id, team, onSubmit }: TeamFormProps) {
  const formik = useFormik({
    initialValues: team || {
      name: "",
      external: true,
      state: "active",
      has_pre_release_access: false,
    },
    validationSchema: TeamSchema,
    onSubmit: (values) => onSubmit(values as ITeam),
  });

  type FormField = "name" | "external" | "state" | "has_pre_release_access";

  function isNotValid(key: FormField) {
    return formik.touched[key] && Boolean(formik.errors[key]);
  }

  function getErrorMessage(key: FormField) {
    return (formik.touched[key] && formik.errors[key]) || "";
  }

  return (
    <Form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <InputGroup
        id="user-form-name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("name")}
        errorMessage={getErrorMessage("name")}
      />
      <SelectGroup
        id="team-form-state"
        data-testid="team-form-state"
        label="State"
        name="state"
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
        value={formik.values.state}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <CheckboxGroup
        id="team-form-external"
        name="external"
        label="Partner"
        isChecked={formik.values.external}
        onChange={formik.handleChange}
      />
      <CheckboxGroup
        id="team-form-has_pre_release_access"
        name="has_pre_release_access"
        label="Pre release access"
        isChecked={formik.values.has_pre_release_access}
        onChange={formik.handleChange}
      />
    </Form>
  );
}

export default TeamForm;
