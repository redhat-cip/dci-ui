import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon
} from "@patternfly/react-icons";
import { Button, DropdownItem, DropdownPosition } from "@patternfly/react-core";
import { CopyButton, Labels, KebabDropdown } from "ui";
import teamsActions, { fetchUsersForTeam } from "./teamsActions";
import usersActions, { deleteUserFromTeam } from "users/usersActions";
import { getUsers } from "users/usersSelectors";
import AddUserToTeamModal from "./AddUserToTeamModal";
import EditTeamModal from "./EditTeamModal";

export class Team extends Component {
  state = {
    isExpanded: false,
    isLoading: true,
    isAddUserToTeamModalOpen: false,
    isEditTeamModalOpen: false,
    teamUsers: []
  };

  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }

  fetchUsersForTeam = () => {
    const { team, fetchUsersForTeam } = this.props;
    return fetchUsersForTeam(team).then(response => {
      this.setState({
        teamUsers: response.data.users,
        isLoading: false
      });
      return response;
    });
  };

  toggleAndFetchUsers = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
      isLoading: true
    }));
    this.fetchUsersForTeam();
  };

  getUserDropdownItems = (user, team) => {
    const { currentUser, deleteUserFromTeam, history } = this.props;

    const userDropdownItems = [
      <DropdownItem
        component="button"
        onClick={() => history.push(`/users/${user.id}`)}
      >
        <EditAltIcon className="pf-u-mr-xs" /> Edit {user.name} user
      </DropdownItem>
    ];
    if (currentUser.isSuperAdmin) {
      userDropdownItems.push(
        <DropdownItem
          component="button"
          onClick={() => {
            deleteUserFromTeam(user, team);
            this.fetchUsersForTeam();
          }}
        >
          <WarningTriangleIcon className="pf-u-mr-xs" /> delete {user.name} user
          from {team.name} team
        </DropdownItem>
      );
    }
    return userDropdownItems;
  };

  openAddUserToTeamModal = () => {
    this.setState({ isAddUserToTeamModalOpen: true });
  };

  closeAddUserToTeamModal = () => {
    this.setState({ isAddUserToTeamModalOpen: false });
  };

  openEditTeamModal = () => {
    this.setState({ isEditTeamModalOpen: true });
  };

  closeEditTeamModal = () => {
    this.setState({ isEditTeamModalOpen: false });
  };

  render() {
    const { currentUser, team, users, deleteTeam } = this.props;
    const {
      isExpanded,
      isLoading,
      teamUsers,
      isAddUserToTeamModalOpen,
      isEditTeamModalOpen
    } = this.state;

    const teamDropdownItems = [
      <DropdownItem component="button" onClick={this.openAddUserToTeamModal}>
        <PlusCircleIcon className="pf-u-mr-xs" />
        Add a user to {team.name} team
      </DropdownItem>,
      <DropdownItem component="button" onClick={this.openEditTeamModal}>
        <EditAltIcon className="pf-u-mr-xs" /> Edit {team.name} team
      </DropdownItem>
    ];
    if (currentUser.isSuperAdmin) {
      teamDropdownItems.push(
        <DropdownItem component="button" onClick={() => deleteTeam(team)}>
          <WarningTriangleIcon className="pf-u-mr-xs" /> delete {team.name} team
        </DropdownItem>
      );
    }

    return (
      <React.Fragment>
        <AddUserToTeamModal
          team={team}
          users={users}
          isOpen={isAddUserToTeamModalOpen}
          close={this.closeAddUserToTeamModal}
          onOk={() => {
            this.fetchUsersForTeam().then(() =>
              this.setState({ isExpanded: true })
            );
            this.closeAddUserToTeamModal();
          }}
        />
        <EditTeamModal
          isOpen={isEditTeamModalOpen}
          team={team}
          close={this.closeEditTeamModal}
          onOk={() => {
            this.closeEditTeamModal();
          }}
        />
        <tbody className={isExpanded ? "pf-m-expanded" : ""}>
          <tr>
            <td className="pf-c-table__toggle">
              <button
                className="pf-c-button pf-m-plain pf-m-expanded"
                onClick={this.toggleAndFetchUsers}
              >
                {isExpanded ? (
                  <i className="fas fa-angle-down"></i>
                ) : (
                  <i className="fas fa-angle-right"></i>
                )}
              </button>
            </td>
            <th>
              <CopyButton text={team.id} />
            </th>
            <th>{team.name}</th>
            <td>
              {team.external ? <Labels.Default>partner</Labels.Default> : null}
            </td>
            <td>
              {team.state === "active" ? (
                <Labels.Success>active</Labels.Success>
              ) : (
                <Labels.Error>inactive</Labels.Error>
              )}
            </td>
            <td>{team.from_now}</td>
            <td className="pf-c-table__action">
              {currentUser.hasEPMRole && (
                <KebabDropdown
                  position={DropdownPosition.right}
                  items={teamDropdownItems}
                />
              )}
            </td>
          </tr>
          <tr
            className={`pf-c-table__expandable-row ${
              isExpanded ? "pf-m-expanded" : ""
            }`}
          >
            <td className="pf-m-no-padding pf-u-pb-xl" colSpan="7">
              <table className="pf-c-table pf-m-compact pf-m-no-border-rows">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Login</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {isExpanded && isLoading && isEmpty(teamUsers) && (
                    <tr>
                      <td>loading...</td>
                    </tr>
                  )}
                  {isExpanded && !isLoading && isEmpty(teamUsers) && (
                    <tr>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={this.openAddUserToTeamModal}
                        >
                          <PlusCircleIcon className="pf-u-mr-xs" />
                          Add a user to {team.name} team
                        </Button>
                      </td>
                    </tr>
                  )}
                  {teamUsers.map(user => (
                    <tr key={user.id}>
                      <td data-label="Id">
                        <CopyButton text={user.id} />
                      </td>
                      <td data-label="User name">{user.name}</td>
                      <td data-label="User fullname">{user.fullname}</td>
                      <td data-label="User email">{user.email}</td>
                      <td data-label="User created">{user.created_at}</td>
                      <td className="pf-c-table__action">
                        {currentUser.hasEPMRole && (
                          <KebabDropdown
                            position={DropdownPosition.right}
                            items={this.getUserDropdownItems(user, team)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(usersActions.all()),
    fetchUsersForTeam: team => dispatch(fetchUsersForTeam(team)),
    deleteUserFromTeam: (user, team) =>
      dispatch(deleteUserFromTeam(user, team)),
    deleteTeam: team => dispatch(teamsActions.delete(team))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team);
