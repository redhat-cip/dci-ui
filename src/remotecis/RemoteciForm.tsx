import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormGroup } from "@patternfly/react-core";
import TeamSelect from "teams/form/TeamSelect";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import FormErrorMessage from "ui/form/FormErrorMessage";
import { IRemoteci } from "types";

const RemoteciSchema = Yup.object().shape({
  name: Yup.string()
    .required("Remoteci name is required")
    .min(2, "Remoteci name is too short!"),
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function RemoteciForm({
  id,
  remoteci,
  onSubmit,
  ...props
}: {
  id: string;
  remoteci?: IRemoteci;
  onSubmit: (values: { name: string; team_id: string }) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(RemoteciSchema),
    defaultValues: remoteci || { name: "", team_id: "" },
  });
  const teamIdError = methods.formState.errors.team_id;
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <TextInputFormGroup
          label="Name"
          id="remoteci_form__name"
          name="name"
          isRequired
        />
        <FormGroup label="Team" isRequired fieldId="remoteci_form__team_id">
          <TeamSelect
            id="remoteci_form__team_id"
            value={remoteci ? remoteci.team_id : undefined}
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
