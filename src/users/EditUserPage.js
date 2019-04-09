import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { LoadingPage, Page } from "layout";
import usersActions from "./usersActions";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import UserForm from "./UserForm";

export class EditUserPage extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    const { match, fetchUser, fetchTeams, fetchRoles } = this.props;
    fetchUser({ id: match.params.id }).then(response =>
      this.setState({ user: response.data.user })
    );
    fetchTeams();
    fetchRoles();
  }

  render() {
    const { teams,  updateUser, history } = this.props;
    const { user } = this.state;
    const isFetching = isEmpty(user) || isEmpty(teams) ;
    if (isFetching) return <LoadingPage title="Edit user ..." />;
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
                    }).then(() => history.push("/users"));
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
    teams: getTeams(state),
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: user => dispatch(usersActions.one(user, { embed: "team" })),
    fetchTeams: () => dispatch(teamsActions.all()),
    updateUser: user => dispatch(usersActions.update(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserPage);
