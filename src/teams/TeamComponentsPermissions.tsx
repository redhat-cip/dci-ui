import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
} from "@patternfly/react-core";
import {
  addRemoteTeamPermissionForTheTeam,
  getComponentsPermissions,
  removeRemoteTeamPermissionForTheTeam,
} from "./teamsApi";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal } from "ui";
import { AppDispatch } from "store";
import { ITeam } from "types";
import { Link } from "react-router-dom";
import AddRemoteTeamPermissionModal from "./AddRemoteTeamPermissionModal";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsActions";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

export default function TeamComponentsPermissions({
  team,
  className = "",
}: {
  team: ITeam;
  className?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [teamsTheTeamHasAccessTo, setTeamsTheTeamHasAccessTo] = useState<
    ITeam[]
  >([]);

  const _getComponentsPermissions = useCallback((team: ITeam) => {
    getComponentsPermissions(team)
      .then(setTeamsTheTeamHasAccessTo)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    _getComponentsPermissions(team);
  }, [team, _getComponentsPermissions]);

  return (
    <Card className={className}>
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
                addRemoteTeamPermissionForTheTeam(remoteTeam, team)
                  .then((response) => {
                    _getComponentsPermissions(team);
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
                <Button type="button" variant="secondary" onClick={openModal}>
                  <PlusCircleIcon className="pf-v5-u-mr-xs" />
                  Add access to a team's components
                </Button>
              )}
            </AddRemoteTeamPermissionModal>
          </div>
        </div>
        <div>
          <p className="pf-v5-u-mt-md">
            The {team.name} team has access to the following team components:
          </p>
        </div>
      </CardTitle>
      <CardBody>
        {isLoading ? (
          <Skeleton screenreaderText="Loading team's components permissions" />
        ) : (
          <>
            {teamsTheTeamHasAccessTo.length === 0 ? (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.sm}>
                  <EmptyStateBody>
                    {`The ${team.name} team does not have any special access.`}{" "}
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            ) : (
              <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
                <Thead>
                  <Tr>
                    <Th>Team name</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {sortByName(teamsTheTeamHasAccessTo).map((remoteTeam) => (
                    <Tr key={remoteTeam.id}>
                      <Td>
                        <Link to={`/teams/${remoteTeam.id}`}>
                          {remoteTeam.name}
                        </Link>
                      </Td>
                      <Td className="pf-v5-c-table__action">
                        <ConfirmDeleteModal
                          title={`Remove ${remoteTeam.name} access to ${team.name}`}
                          message={`Are you sure you want to remove user ${remoteTeam.name} access? ${team.name} will not be able to see ${remoteTeam.name} component.`}
                          onOk={() => {
                            removeRemoteTeamPermissionForTheTeam(
                              remoteTeam,
                              team,
                            ).then(() => _getComponentsPermissions(team));
                          }}
                        >
                          {(openModal) => (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={openModal}
                            >
                              <MinusCircleIcon />
                            </Button>
                          )}
                        </ConfirmDeleteModal>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
