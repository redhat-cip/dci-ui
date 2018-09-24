import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import DCICard from "../DCICard";
import actions from "../teams/teamsActions";
import { CopyButton } from "../ui";
import { EmptyState } from "../ui";
import NewTeamButton from "../teams/NewTeamButton";
import EditTeamButton from "../teams/EditTeamButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getTeams } from "../teams/teamsSelectors";
import { MainContent } from "../layout";

export class TeamsContainer extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }
  render() {
    const { teams, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Teams"
          loading={isFetching && isEmpty(teams)}
          empty={!isFetching && isEmpty(teams)}
          HeaderButton={<NewTeamButton className="pull-right" />}
          EmptyComponent={
            <EmptyState
              title="There is no teams"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/teams/create">
                  Create a new team
                </a>
              }
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Parent Team</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={`${team.id}.${team.etag}`}>
                  <td className="text-center">
                    <CopyButton text={team.id} />
                  </td>
                  <td>{team.name.toUpperCase()}</td>
                  <td>
                    {team.parent_team
                      ? team.parent_team.name.toUpperCase()
                      : ""}
                  </td>
                  <td>{team.from_now}</td>
                  <td className="text-center">
                    <EditTeamButton className="mr-1" team={team} />
                    <ConfirmDeleteButton
                      name="team"
                      resource={team}
                      whenConfirmed={team => this.props.deleteTeam(team)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCICard>
      </MainContent>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    isFetching: state.teams.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(actions.all()),
    deleteTeam: team => dispatch(actions.delete(team))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamsContainer);
