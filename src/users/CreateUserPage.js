import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { LoadingPage, Page } from "layout";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import usersActions from "./usersActions";
import UserForm from "./UserForm";

export class CreateUserPage extends Component {
  componentDidMount() {
    const { fetchTeams, fetchRoles } = this.props;
    fetchTeams();
    fetchRoles();
  }

  render() {
    const { teams, createUser, history } = this.props;
    const isFetching = isEmpty(teams);
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
    teams: getTeams(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all()),
    createUser: user => dispatch(usersActions.create(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserPage);
