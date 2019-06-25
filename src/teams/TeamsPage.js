import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  DataList
} from "@patternfly/react-core";
import { Page } from "layout";
import actions from "teams/teamsActions";
import { EmptyState } from "ui";
import NewTeamButton from "teams/NewTeamButton";
import { getTeams } from "teams/teamsSelectors";
import Team from "./Team";

const ToolbarWrapper = styled.div`
  background-color: white;
`;

export class TeamsPage extends Component {
  componentDidMount() {
    const { fetchTeams } = this.props;
    fetchTeams();
  }
  render() {
    const { teams, currentUser, isFetching, deleteTeam } = this.props;
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
        {currentUser.hasEPMRole && (
          <ToolbarWrapper className="pf-u-p-xl">
            <Toolbar className="pf-u-justify-content-space-between">
              <ToolbarGroup>
                <ToolbarItem className="pf-u-mr-md">
                  <NewTeamButton />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup />
            </Toolbar>
          </ToolbarWrapper>
        )}
        <DataList aria-label="Expandable teams list">
          {teams.map(team => (
            <Team
              key={`${team.id}.${team.etag}`}
              team={team}
              currentUser={currentUser}
              deleteConfirmed={() => deleteTeam(team)}
            />
          ))}
        </DataList>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    isFetching: state.teams.isFetching,
    currentUser: state.currentUser
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
)(TeamsPage);
