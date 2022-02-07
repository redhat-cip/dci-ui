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
import { Button, Label } from "@patternfly/react-core";
import { Link, useNavigate } from "react-router-dom";

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
      <table
        className="pf-c-table pf-m-compact pf-m-grid-md"
        role="grid"
        aria-label="Teams table"
        id="teams-table"
      >
        <thead>
          <tr>
            <th>Id</th>
            <th>Team Name</th>
            <th>Partner</th>
            <th>Active</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr>
              <th>
                <CopyButton text={team.id} />
              </th>
              <th>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </th>
              <td>
                {team.external ? <Label color="blue">partner</Label> : null}
              </td>
              <td>
                {team.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </td>
              <td>{team.from_now}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainPage>
  );
}
