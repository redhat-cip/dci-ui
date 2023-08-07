import { useEffect } from "react";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import MainPage from "pages/MainPage";
import teamsActions from "./teamsActions";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import { getTeams, isFetchingTeams } from "./teamsSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { AppDispatch } from "store";
import CreateTeamModal from "./CreateTeamModal";
import { Button, Flex, FlexItem, Label } from "@patternfly/react-core";
import { Link, useNavigate } from "react-router-dom";
import TeamCreationWizard from "./TeamCreationWizard";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

export default function TeamsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const currentUser = useSelector(getCurrentUser);
  const isFetching = useSelector(isFetchingTeams);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);

  if (currentUser === null) return null;

  const partners = teams.filter((t) => t.external && t.state === "active");

  return (
    <MainPage
      title="Teams"
      description={
        partners.length > 0
          ? `List of DCI teams. There are ${partners.length} active partners.`
          : "List of DCI teams."
      }
      loading={isFetching && isEmpty(teams)}
      empty={!isFetching && isEmpty(teams)}
      HeaderButton={
        currentUser.hasEPMRole ? (
          <Flex>
            <Flex>
              <FlexItem>
                <CreateTeamModal
                  onSubmit={(team) =>
                    dispatch(teamsActions.create(team)).then((response) => {
                      const newTeam = response.data.team;
                      navigate(`/teams/${newTeam.id}`);
                    })
                  }
                >
                  {(openModal) => (
                    <Button variant="primary" onClick={openModal}>
                      Create a new team
                    </Button>
                  )}
                </CreateTeamModal>
              </FlexItem>
              <FlexItem>
                <TeamCreationWizard />
              </FlexItem>
            </Flex>
          </Flex>
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no teams"
          info="Do you want to create one?"
        />
      }
      Breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Teams" }]} />
      }
    >
      <Table
        className="pf-v5-c-table pf-m-compact pf-m-grid-md"
        role="grid"
        aria-label="Teams table"
        id="teams-table"
      >
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Team Name</Th>
            <Th>Partner</Th>
            <Th>Active</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams.map((team) => (
            <Tr key={team.id}>
              <Th>
                <CopyButton text={team.id} />
              </Th>
              <Th>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </Th>
              <Td>
                {team.external ? <Label color="blue">partner</Label> : null}
              </Td>
              <Td>
                {team.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </Td>
              <Td>{team.from_now}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </MainPage>
  );
}
