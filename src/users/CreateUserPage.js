import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { LoadingPage, Page } from "layout";
import rolesActions from "roles/rolesActions";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { getRoles } from "roles/rolesSelectors";
import usersActions from "./usersActions";
import UserForm from "./UserForm";

export class CreateUserPage extends Component {
  componentDidMount() {
    const { fetchTeams, fetchRoles } = this.props;
    fetchTeams();
    fetchRoles();
  }

  render() {
    const { teams, roles, createUser, history } = this.props;
    const isFetching = isEmpty(teams) || isEmpty(roles);
    if (isFetching) return <LoadingPage title="Create a user" />;
    return (
      <Page title="Create a user">
        <Grid gutter="md">
          <GridItem span={6}>
            <Card>
              <CardBody>
                <UserForm
                  buttonText="Create user"
                  user={{ name: "" }}
                  submit={user => {
                    createUser(user).then(() => history.push("/users"));
                  }}
                  teams={teams}
                  roles={roles}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    roles: getRoles(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all()),
    fetchRoles: () => dispatch(rolesActions.all()),
    createUser: user => dispatch(usersActions.create(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserPage);
