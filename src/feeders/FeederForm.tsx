import { Form, FormGroup } from "@patternfly/react-core";
import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TeamSelect from "teams/form/TeamSelect";
import { IFeeder } from "types";
import FormErrorMessage from "ui/form/FormErrorMessage";
import TextInputFormGroup from "ui/form/TextInputFormGroup";

const FeederSchema = Yup.object().shape({
  name: Yup.string()
    .required("Feeder name is required")
    .min(2, "Feeder name is too short!"),
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function FeederForm({
  id,
  feeder,
  onSubmit,
  ...props
}: {
  id: string;
  feeder?: IFeeder;
  onSubmit: (values: { name: string; team_id: string }) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(FeederSchema),
    defaultValues: feeder || { name: "", team_id: "" },
  });
  const teamIdError = methods.formState.errors.team_id;
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <TextInputFormGroup
          label="Name"
          id="feeder_form__name"
          name="name"
          isRequired
        />
        <FormGroup label="Team" isRequired fieldId="feeder_form__team_id">
          <TeamSelect
            id="feeder_form__team_id"
            value={feeder ? feeder.team_id : undefined}
            placeholder="Select a team"
            hasError={teamIdError !== undefined}
            onSelect={(item) => {
              if (item) {
                methods.setValue("team_id", item.id, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
          <FormErrorMessage error={teamIdError} />
        </FormGroup>
      </Form>
    </FormProvider>
  );
}
