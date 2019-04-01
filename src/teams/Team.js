import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { UsersIcon } from "@patternfly/react-icons";
import {
  DataListItem,
  DataListCell,
  DataListToggle,
  DataListContent,
  Text,
  TextVariants,
  DataListAction
} from "@patternfly/react-core";
import { CopyButton, Labels, ConfirmDeleteButton } from "ui";
import { getUsers } from "./teamsActions";
import EditTeamButton from "./EditTeamButton";

const UsersDataListCell = styled.div`
  cursor: pointer;
`;

export class Team extends Component {
  state = {
    isExpanded: false,
    isLoading: true,
    users: []
  };

  getUsersAndToggle = () => {
    const { team, getUsers } = this.props;
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
      isLoading: true
    }));
    getUsers(team).then(response =>
      this.setState({
        users: response.data.users,
        isLoading: false
      })
    );
  };

  render() {
    const { team, deleteConfirmed } = this.props;
    const { isExpanded, isLoading, users } = this.state;
    return (
      <DataListItem
        aria-labelledby={`data list item for ${team.name}`}
        isExpanded={isExpanded}
      >
        <DataListToggle
          onClick={this.getUsersAndToggle}
          isExpanded={isExpanded}
          id={`${team.name} toggle`}
          aria-controls={`${team.name} expand`}
        />
        <DataListCell>
          <CopyButton text={team.id} />
        </DataListCell>
        <DataListCell width={2}>
          <div id="name">{team.name}</div>
        </DataListCell>
        <DataListCell width={1}>
          <div id="partner">
            {team.external ? <Labels.Success>partner</Labels.Success> : null}
          </div>
        </DataListCell>
        <DataListCell width={2}>
          <UsersDataListCell id="users" onClick={this.getUsersAndToggle}>
            <UsersIcon /> users
          </UsersDataListCell>
        </DataListCell>
        <DataListCell width={1}>
          <div id="created">{team.from_now}</div>
        </DataListCell>
        <DataListCell width={1}>
          <EditTeamButton className="pf-u-mr-xs" team={team} />
          <ConfirmDeleteButton
            title={`Delete team ${team.name}`}
            content={`Are you sure you want to delete ${team.name}?`}
            whenConfirmed={deleteConfirmed}
          />
        </DataListCell>
        <DataListContent
          aria-label={`user list content for ${team.name}`}
          isHidden={!isExpanded}
        >
          {isLoading ? (
            <div>loading...</div>
          ) : (
            <div>
              <Text component={TextVariants.h1} className="pf-u-ml-xl">
                <UsersIcon /> {`${team.name} users list`}
              </Text>
              <table
                className="pf-c-table pf-m-compact pf-m-grid-md"
                role="grid"
                aria-label="users list"
                id="compact-table"
              >
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Login</th>
                    <th scope="col">Full name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Created</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td data-label="Id">
                        <CopyButton text={user.id} />
                      </td>
                      <td data-label="User name">{user.name}</td>
                      <td data-label="User fullname">{user.fullname}</td>
                      <td data-label="User email">{user.email}</td>
                      <td data-label="User email">{user.role_id}</td>
                      <td data-label="User created">{user.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataListContent>
      </DataListItem>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: team => dispatch(getUsers(team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Team);
