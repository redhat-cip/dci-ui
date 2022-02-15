import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { SelectWithTypeahead } from "ui/formik";
import * as Yup from "yup";
import { ITeam } from "types";
import { AppDispatch } from "store";
import { Formik, Form } from "formik";
import teamsActions from "teams/teamsActions";

interface AddUserToTeamFormProps {
  onSubmit: (team: ITeam) => void;
}

const AddUserToTeamSchema = Yup.object().shape({
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function AddUserToTeamForm({
  onSubmit,
}: AddUserToTeamFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [teams, setTeams] = useState<ITeam[]>([]);

  useEffect(() => {
    dispatch(teamsActions.all()).then((response) => {
      setTeams(response.data.teams);
    });
  }, [dispatch]);

  return (
    <Formik
      initialValues={{ team_id: "" }}
      validationSchema={AddUserToTeamSchema}
      onSubmit={(v) => {
        const selectedTeam = teams.find((t) => t.id === v.team_id);
        if (selectedTeam) {
          onSubmit(selectedTeam);
        }
      }}
    >
      {({ isValid, dirty }) => (
        <Form id="add_user_to_team_form" className="pf-c-form">
          <div>
            <Flex>
              <FlexItem>Add user in</FlexItem>
              <FlexItem>
                <SelectWithTypeahead
                  id="add_user_to_team_formadd_user_to_team_form__team_id"
                  name="team_id"
                  option={""}
                  options={teams.map((t) => ({ label: t.name, value: t.id }))}
                />
              </FlexItem>
              <FlexItem>team</FlexItem>
              <FlexItem>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={!(isValid && dirty)}
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
