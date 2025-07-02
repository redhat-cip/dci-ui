import * as Yup from "yup";
import type { ITeam } from "types";
import { Form } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import SelectFormGroup from "ui/form/SelectFormGroup";
import CheckboxFormGroup from "ui/form/CheckboxFormGroup";

const TeamSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Team name is too short!")
    .required("Team name is required"),
  state: Yup.string().required(),
  external: Yup.boolean(),
  has_pre_release_access: Yup.boolean(),
});

export default function TeamForm({
  id,
  team,
  onSubmit,
  ...props
}: {
  id: string;
  team?: ITeam;
  onSubmit: (values: ITeam) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(TeamSchema),
    defaultValues: team || {
      name: "",
      state: "active",
      external: true,
      has_pre_release_access: false,
    },
  });
  return (
    <FormProvider {...methods}>
      <Form
        id={id}
        onSubmit={methods.handleSubmit((values) => {
          return onSubmit(values as ITeam);
        })}
        {...props}
      >
        <TextInputFormGroup
          label="Name"
          id="team_form__name"
          name="name"
          isRequired
        />
        <SelectFormGroup
          id="team_form__state"
          label="State"
          name="state"
          isRequired
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
        <CheckboxFormGroup
          id="team_form__external"
          name="external"
          label="Partner"
        />
        <CheckboxFormGroup
          id="team_form__has_pre_release_access"
          name="has_pre_release_access"
          label="Pre release access"
        />
      </Form>
    </FormProvider>
  );
}
