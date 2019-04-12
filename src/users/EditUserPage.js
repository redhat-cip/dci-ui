import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { LoadingPage, Page } from "layout";
import usersActions from "./usersActions";
import UserForm from "./UserForm";
import {
  fetchUserTeams,
  addUserToTeam,
  deleteUserFromTeam
} from "./usersActions";
import { CopyButton, ConfirmDeleteButton } from "ui";
import AddUserToTeamForm from "./AddUserToTeamsForm";

export class EditUserPage extends Component {
  state = {
    user: null,
    user_teams: []
  };

  componentDidMount() {
    const { match, fetchUser } = this.props;
    fetchUser({ id: match.params.id }).then(response =>
      this.setState({ user: response.data.user })
    );
    this.fetchUserTeams();
  }

  fetchUserTeams = () => {
    const { match, fetchUserTeams } = this.props;
    fetchUserTeams({ id: match.params.id }).then(response =>
      this.setState({ user_teams: response.data.teams })
    );
  };

  render() {
    const { updateUser, addUserToTeam, deleteUserFromTeam } = this.props;
    const { user, user_teams } = this.state;
    if (isEmpty(user)) return <LoadingPage title="Edit user ..." />;
    return (
      <Page title={`Edit user ${user.fullname}`}>
        <Grid gutter="md">
          <GridItem span={6}>
            <Card>
              <CardBody>
                <UserForm
                  user={user}
                  buttonText="Edit user"
                  submit={newUser => {
                    updateUser({
                      id: user.id,
                      ...newUser
                    }).then(response =>
                      this.setState(prevState => ({
                        user: {
                          ...prevState.user,
                          ...response.data.user
                        }
                      }))
                    );
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card className="pf-u-mb-md">
              <CardBody>
                <AddUserToTeamForm
                  onSubmit={(team, role) => {
                    addUserToTeam(user, team, role).then(this.fetchUserTeams);
                  }}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <table className="pf-c-table pf-m-compact pf-m-grid-md">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Team name</th>
                      <th>Role</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {user_teams.map(team => (
                      <tr key={team.id}>
                        <td>
                          <CopyButton text={team.id} />
                        </td>
                        <td>{team.name}</td>
                        <td>{team.role}</td>
                        <td className="pf-c-table__action">
                          <ConfirmDeleteButton
                            title={`Delete ${user.name} from ${team.name}`}
                            content={`Are you sure you want to remove user ${
                              user.name
                            } from team ${team.name}?`}
                            whenConfirmed={() => {
                              deleteUserFromTeam(user, team).then(
                                this.fetchUserTeams
                              );
                            }}
                            isDisabled={team.role === "SUPER_ADMIN"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: user => dispatch(usersActions.one(user)),
    fetchUserTeams: user => dispatch(fetchUserTeams(user)),
    updateUser: user => dispatch(usersActions.update(user)),
    deleteUserFromTeam: (user, team) =>
      dispatch(deleteUserFromTeam(user, team)),
    addUserToTeam: (user, team, role) =>
      dispatch(addUserToTeam(user, team, role))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditUserPage);
