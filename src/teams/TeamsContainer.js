import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Page } from "../layout";
import actions from "../teams/teamsActions";
import { CopyButton, EmptyState, Labels, ConfirmDeleteButton } from "../ui";
import NewTeamButton from "../teams/NewTeamButton";
import EditTeamButton from "../teams/EditTeamButton";
import { getTeams } from "../teams/teamsSelectors";

export class TeamsContainer extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }
  render() {
    const { teams, isFetching } = this.props;
    return (
      <Page
        title="Teams"
        loading={isFetching && isEmpty(teams)}
        empty={!isFetching && isEmpty(teams)}
        HeaderButton={<NewTeamButton />}
        EmptyComponent={
          <EmptyState
            title="There is no teams"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th>Name</th>
              <th className="pf-u-text-align-center">Partner</th>
              <th>Parent Team</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={`${team.id}.${team.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={team.id} />
                </td>
                <td>{team.name.toUpperCase()}</td>
                <td className="pf-u-text-align-center">
                  {team.external ? (
                    <Labels.Success>partner</Labels.Success>
                  ) : null}
                </td>
                <td>
                  {team.parent_team ? team.parent_team.name.toUpperCase() : ""}
                </td>
                <td>{team.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditTeamButton className="pf-u-mr-xl" team={team} />
                  <ConfirmDeleteButton
                    title={`Delete team ${team.name}`}
                    content={`Are you sure you want to delete ${team.name}?`}
                    whenConfirmed={() => this.props.deleteTeam(team)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
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
