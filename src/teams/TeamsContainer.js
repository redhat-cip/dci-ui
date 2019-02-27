import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { Page } from "layout";
import actions from "teams/teamsActions";
import { EmptyState } from "ui";
import NewTeamButton from "teams/NewTeamButton";
import { getTeams } from "teams/teamsSelectors";
import TeamRow from "./TeamRow";

export class TeamsContainer extends Component {
  componentDidMount() {
    const { fetchTeams } = this.props;
    fetchTeams();
  }
  render() {
    const { teams, isFetching, deleteTeam } = this.props;
    return (
      <Page
        title="Teams"
        loading={isFetching && isEmpty(teams)}
        empty={!isFetching && isEmpty(teams)}
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
              <th colSpan={6}>
                <Toolbar className="pf-u-justify-content-space-between pf-u-mv-md">
                  <ToolbarGroup>
                    <ToolbarItem className="pf-u-mr-md">
                      <NewTeamButton />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup />
                </Toolbar>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Partner</th>
              <th>Parent Team</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <TeamRow
                key={`${team.id}.${team.etag}`}
                team={team}
                deleteConfirmed={() => deleteTeam(team)}
              />
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
