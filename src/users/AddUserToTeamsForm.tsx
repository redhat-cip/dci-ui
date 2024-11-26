import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { SelectWithTypeahead } from "ui/formik";
import * as Yup from "yup";
import { ITeam } from "types";
import { Formik, Form } from "formik";
import { useListTeamsQuery } from "teams/teamsApi";

interface AddUserToTeamFormProps {
  onSubmit: (team: ITeam) => void;
  [key: string]: any;
}

const AddUserToTeamSchema = Yup.object().shape({
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function AddUserToTeamForm({
  onSubmit,
  ...props
}: AddUserToTeamFormProps) {
  const { data } = useListTeamsQuery({ limit: 200 });

  if (!data) return null;

  return (
    <Formik
      initialValues={{ team_id: "" }}
      validationSchema={AddUserToTeamSchema}
      onSubmit={(v) => {
        const selectedTeam = data.teams.find((t) => t.id === v.team_id);
        if (selectedTeam) {
          onSubmit(selectedTeam);
        }
      }}
    >
      {({ isValid, dirty }) => (
        <Form id="add_user_to_team_form" className="pf-v6-c-form">
          <div>
            <Flex>
              <FlexItem>Add user in</FlexItem>
              <FlexItem>
                <SelectWithTypeahead
                  id="add_user_to_team_formadd_user_to_team_form__team_id"
                  name="team_id"
                  options={data.teams.map((t) => ({
                    label: t.name,
                    value: t.id,
                  }))}
                />
              </FlexItem>
              <FlexItem>team</FlexItem>
              <FlexItem>
                <Button
                  variant="secondary"
                  type="submit"
                  isDisabled={!(isValid && dirty)}
                  {...props}
                >
                  Add
                </Button>
              </FlexItem>
            </Flex>
          </div>
        </Form>
      )}
    </Formik>
  );
}
