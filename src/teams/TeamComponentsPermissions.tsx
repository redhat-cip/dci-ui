import {
  Card,
  CardBody,
  Button,
  CardTitle,
  Skeleton,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  Content,
} from "@patternfly/react-core";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal } from "ui";
import { useAppDispatch } from "store";
import { ITeam } from "types";
import { Link } from "react-router";
import AddRemoteTeamPermissionModal from "./AddRemoteTeamPermissionModal";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsSlice";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  useAddTeamPermissionForTeamMutation,
  useGetComponentsPermissionsQuery,
  useRemoveTeamPermissionForTeamMutation,
} from "./teamsApi";

function TeamComponentsPermissionsTable({ team }: { team: ITeam }) {
  const { data, isLoading, isFetching } = useGetComponentsPermissionsQuery(
    team.id,
  );
  const [removeRemoteTeamPermissionForTheTeam] =
    useRemoveTeamPermissionForTeamMutation();
  if (isLoading || isFetching) {
    return (
      <Skeleton screenreaderText="Loading team's components permissions" />
    );
  }

  if (!data) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateBody>
            {`The ${team.name} team does not have any special access.`}
          </EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  return (
    <>
      <Content component="p">
        The {team.name} team has access to the components of the following
        teams:
      </Content>
      <Table borders={false}>
        <Thead>
          <Tr>
            <Th>Team name</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {sortByName(data).map((remoteTeam) => (
            <Tr key={remoteTeam.id}>
              <Td>
                <Link to={`/teams/${remoteTeam.id}`}>{remoteTeam.name}</Link>
              </Td>
              <Td isActionCell>
                <ConfirmDeleteModal
                  title={`Remove ${remoteTeam.name} access to ${team.name}`}
                  message={`Are you sure you want to remove user ${remoteTeam.name} access? ${team.name} will not be able to see ${remoteTeam.name} component.`}
                  onOk={() => {
                    removeRemoteTeamPermissionForTheTeam({ remoteTeam, team });
                  }}
                >
                  {(openModal) => (
                    <Button
                      icon={<MinusCircleIcon />}
                      variant="danger"
                      onClick={openModal}
                    ></Button>
                  )}
                </ConfirmDeleteModal>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

export default function TeamComponentsPermissions({
  team,
  ...props
}: {
  team: ITeam;
  [k: string]: any;
}) {
  const dispatch = useAppDispatch();
  const [addRemoteTeamPermissionForTheTeam] =
    useAddTeamPermissionForTeamMutation();

  return (
    <Card {...props}>
      <CardTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>Components permissions</div>
          <div>
            <AddRemoteTeamPermissionModal
              team={team}
              onTeamSelected={(remoteTeam) => {
                addRemoteTeamPermissionForTheTeam({ remoteTeam, team })
                  .then((response) => {
                    dispatch(
                      showSuccess(
                        `${team.name} team can see component of ${remoteTeam.name} team.`,
                      ),
                    );
                    return response;
                  })
                  .catch((error) => {
                    dispatch(
                      showError(
                        `We can't add permission for ${remoteTeam.name} to ${team.name} team`,
                      ),
                    );
                    return error;
                  });
              }}
            >
              {(openModal) => (
                <Button
                  icon={<PlusCircleIcon className="pf-v6-u-mr-xs" />}
                  type="button"
                  variant="secondary"
                  onClick={openModal}
                >
                  Add access to a team's components
                </Button>
              )}
            </AddRemoteTeamPermissionModal>
          </div>
        </div>
      </CardTitle>
      <CardBody>
        <TeamComponentsPermissionsTable team={team} />
      </CardBody>
    </Card>
  );
}
