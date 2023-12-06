import {
  Banner,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Progress,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from "@patternfly/react-core";
import { CogsIcon } from "@patternfly/react-icons";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { TeamCreationWizardValues } from "./TeamCreationWizardTypes";
import { useNavigate } from "react-router-dom";
import { splitTeamMembersString } from "./TeamMembersForm";
import { ITeam } from "types";
import { getOrCreateTeam, useAddProductToTeamMutation } from "./teamsApi";
import { getOrCreateUser, useAddUserToTeamMutation } from "users/usersApi";

export default function CreateTeamWithMembers({
  close,
}: {
  close: () => void;
}) {
  const [addUserToTeam] = useAddUserToTeamMutation();
  const [addProductToTeam] = useAddProductToTeamMutation();
  const { values } = useFormikContext<TeamCreationWizardValues>();
  const [teamCreated, setTeamCreated] = useState<ITeam | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const hasError = error !== "";

  useEffect(() => {
    if (hasError) return;

    getOrCreateTeam({
      name: values.name,
      external: values.external,
      has_pre_release_access: values.has_pre_release_access,
      state: "active",
    })
      .then((newTeam) => {
        setPercent(25);
        const createUsersPromises = splitTeamMembersString(
          values.teamMembers,
        ).map((sso_username) => getOrCreateUser({ sso_username }));

        Promise.all(createUsersPromises)
          .then((users) => {
            setPercent(50);
            const associateUsersToTeamPromises = users.map((user) =>
              addUserToTeam({ user, team: newTeam }),
            );
            Promise.all(associateUsersToTeamPromises)
              .then(() => {
                setPercent(75);
                const productPermissionPromises = Object.values(
                  values.permissions,
                ).map((product) =>
                  addProductToTeam({ team: newTeam, product }),
                );
                Promise.all(productPermissionPromises)
                  .then(() => {
                    setPercent(100);
                    setTeamCreated(newTeam);
                  })
                  .catch(() =>
                    setError(
                      "Error associating the team to the products. Please contact a DCI administrator.",
                    ),
                  );
              })
              .catch(() =>
                setError(
                  "Error associating users to the team. Please contact a DCI administrator.",
                ),
              );
          })
          .catch(() =>
            setError(
              "Users creation failed. Please contact a DCI administrator.",
            ),
          );
      })
      .catch(() =>
        setError("Team creation failed. Please contact a DCI administrator."),
      );
    // eslint-disable-next-line
  }, [error]);

  return (
    <div className="pf-l-bullseye">
      <EmptyState variant="lg">
        <EmptyStateHeader
          titleText={
            <>{percent === 100 ? "Team creation complete" : "Creating team"}</>
          }
          icon={<EmptyStateIcon icon={CogsIcon} />}
          headingLevel="h4"
        />
        <EmptyStateBody>
          <Progress
            value={percent}
            measureLocation="outside"
            aria-label="validation-progress"
          />
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateBody>
            Please give us a few seconds to complete this process. We will
            create this team, with users and associated permissions.
          </EmptyStateBody>
          <EmptyStateBody>
            {hasError && (
              <Banner variant="red" className="pf-v5-u-mb-xs">
                {error}
              </Banner>
            )}
          </EmptyStateBody>
          {percent === 100 && teamCreated !== null && (
            <EmptyStateActions>
              <Button
                onClick={() => {
                  navigate(`/teams/${teamCreated.id}`);
                  close();
                }}
              >
                {`See ${values.name} team`}
              </Button>
            </EmptyStateActions>
          )}
        </EmptyStateFooter>
      </EmptyState>
    </div>
  );
}
