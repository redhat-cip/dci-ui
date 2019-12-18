import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon
} from "@patternfly/react-icons";
import { Button, DropdownItem, DropdownPosition } from "@patternfly/react-core";
import {
  ConfirmDeleteModal as DeleteTeamModal,
  CopyButton,
  Labels,
  KebabDropdown
} from "ui";
import teamsActions, { fetchUsersForTeam } from "./teamsActions";
import { deleteUserFromTeam } from "users/usersActions";
import AddUserToTeamModal from "./AddUserToTeamModal";
import EditTeamModal from "./EditTeamModal";

export class Team extends Component {
  state = {
    isExpanded: false,
    isLoading: true,
    isAddUserToTeamModalOpen: false,
    isEditTeamModalOpen: false,
    isDeleteTeamModalOpen: false,
    teamUsers: []
  };

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
    const { deleteUserFromTeam, history } = this.props;

    const userDropdownItems = [
      <DropdownItem
        key={`edit_user_${user.id}_dropdown`}
        component="button"
        onClick={() => history.push(`/users/${user.id}`)}
      >
        <EditAltIcon className="pf-u-mr-xs" /> Edit {user.name} user
      </DropdownItem>,
      <DropdownItem
        key={`remove_user_from_team_${user.id}_dropdown`}
        component="button"
        onClick={() => {
          deleteUserFromTeam(user, team);
          this.fetchUsersForTeam();
        }}
      >
        <WarningTriangleIcon className="pf-u-mr-xs" /> delete {user.name} user
        from {team.name} team
      </DropdownItem>
    ];
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

  openDeleteTeamModal = () => {
    this.setState({ isDeleteTeamModalOpen: true });
  };

  closeDeleteTeamModal = () => {
    this.setState({ isDeleteTeamModalOpen: false });
  };

  render() {
    const { currentUser, team, users, deleteTeam } = this.props;
    const {
      isExpanded,
      isLoading,
      teamUsers,
      isAddUserToTeamModalOpen,
      isEditTeamModalOpen,
      isDeleteTeamModalOpen
    } = this.state;

    const teamDropdownItems = [
      <DropdownItem
        key="add_user_to_team_dropdown"
        component="button"
        onClick={this.openAddUserToTeamModal}
      >
        <PlusCircleIcon className="pf-u-mr-xs" />
        Add a user to {team.name} team
      </DropdownItem>,
      <DropdownItem
        key="edit_team_dropdown"
        component="button"
        onClick={this.openEditTeamModal}
      >
        <EditAltIcon className="pf-u-mr-xs" /> Edit {team.name} team
      </DropdownItem>
    ];
    if (currentUser.isSuperAdmin) {
      teamDropdownItems.push(
        <DropdownItem
          key="delete_team_dropdown"
          component="button"
          onClick={this.openDeleteTeamModal}
        >
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
        <DeleteTeamModal
          title={`Delete team ${team.name}`}
          isOpen={isDeleteTeamModalOpen}
          close={this.closeDeleteTeamModal}
          onOk={() => {
            deleteTeam(team).then(this.closeDeleteTeamModal);
          }}
          isSmall
        >
          {`Are you sure you want to delete ${team.name} team?`}
        </DeleteTeamModal>
        <EditTeamModal
          isOpen={isEditTeamModalOpen}
          team={team}
          close={this.closeEditTeamModal}
          onOk={this.closeEditTeamModal}
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
                    <tr key={`${user.id}.${user.etag}`}>
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

function mapDispatchToProps(dispatch) {
  return {
    fetchUsersForTeam: team => dispatch(fetchUsersForTeam(team)),
    deleteUserFromTeam: (user, team) =>
      dispatch(deleteUserFromTeam(user, team)),
    deleteTeam: team => dispatch(teamsActions.delete(team))
  };
}

export default connect(null, mapDispatchToProps)(Team);
