import { Button, Flex, FlexItem, Form } from "@patternfly/react-core";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TeamSelect from "teams/form/TeamSelect";
import FormErrorMessage from "ui/form/FormErrorMessage";

interface AddUserToTeamFormProps {
  onSubmit: (values: { team_id: string }) => void;
  [key: string]: any;
}

const AddUserToTeamSchema = Yup.object().shape({
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function AddUserToTeamForm({
  onSubmit,
  ...props
}: AddUserToTeamFormProps) {
  const methods = useForm({
    resolver: yupResolver(AddUserToTeamSchema),
    defaultValues: { team_id: "" },
  });
  const { isDirty, isValid } = methods.formState;
  const teamIdError = methods.formState.errors.team_id;

  return (
    <Form
      id="add_user_to_team_form"
      onSubmit={methods.handleSubmit(onSubmit)}
      {...props}
    >
      <Flex>
        <FlexItem>Add user in</FlexItem>
        <FlexItem>
          <TeamSelect
            id="add_user_to_team_form__team_id"
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
        </FlexItem>
        <FlexItem>team</FlexItem>
        <FlexItem>
          <Button
            variant="secondary"
            type="submit"
            isDisabled={!(isValid && isDirty)}
            form="add_user_to_team_form"
          >
            Add
          </Button>
        </FlexItem>
      </Flex>
    </Form>
  );
}
