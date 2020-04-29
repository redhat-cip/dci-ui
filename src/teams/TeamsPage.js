import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Button } from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Page } from "layout";
import teamsActions from "./teamsActions";
import usersActions from "users/usersActions";
import { EmptyState } from "ui";
import { getTeams } from "./teamsSelectors";
import Team from "./Team";
import NewTeamModal from "./NewTeamModal";
import { getUsers } from "users/usersSelectors";

export class TeamsPage extends Component {
  state = {
    isNewTeamModalOpen: false,
  };

  openNewTeamModal = () => {
    this.setState({ isNewTeamModalOpen: true });
  };

  closeNewTeamModal = () => {
    this.setState({ isNewTeamModalOpen: false });
  };

  componentDidMount() {
    const { fetchTeams, fetchUsers } = this.props;
    fetchTeams();
    fetchUsers();
  }
  render() {
    const {
      teams,
      users,
      currentUser,
      isFetching,
      deleteTeam,
      history,
    } = this.props;
    const { isNewTeamModalOpen } = this.state;
    return (
      <Page
        title="Teams"
        loading={isFetching && isEmpty(teams)}
        empty={!isFetching && isEmpty(teams)}
        HeaderButton={
          currentUser.hasEPMRole ? (
            <Button onClick={this.openNewTeamModal}>
              <PlusCircleIcon className="mr-xs" />
              Create a new team
            </Button>
          ) : null
        }
        EmptyComponent={
          <EmptyState
            title="There is no teams"
            info="Do you want to create one?"
          />
        }
      >
        <NewTeamModal
          isOpen={isNewTeamModalOpen}
          close={this.closeNewTeamModal}
          onOk={this.closeNewTeamModal}
        />
        <table
          className="pf-c-table pf-m-expandable pf-m-grid-lg"
          role="grid"
          aria-label="Teams table"
          id="teams-table"
        >
          <thead>
            <tr>
              <td></td>
              <th scope="col">Id</th>
              <th scope="col">Team Name</th>
              <th scope="col">Partner</th>
              <th scope="col">Active</th>
              <th scope="col">Created at</th>
              <td></td>
            </tr>
          </thead>
          {teams.map((team) => (
            <Team
              key={`${team.id}.${team.etag}`}
              team={team}
              users={users}
              currentUser={currentUser}
              deleteTeam={() => deleteTeam(team)}
              history={history}
            />
          ))}
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    users: getUsers(state),
    isFetching: state.teams.isFetching && state.users.isFetching,
    currentUser: state.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all()),
    fetchUsers: () => dispatch(usersActions.all()),
    deleteTeam: (team) => dispatch(teamsActions.delete(team)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);
