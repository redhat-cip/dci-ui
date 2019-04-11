import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { LoadingPage, Page } from "layout";
import usersActions from "./usersActions";
import UserForm from "./UserForm";

export class EditUserPage extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    const { match, fetchUser } = this.props;
    fetchUser({ id: match.params.id }).then(response =>
      this.setState({ user: response.data.user })
    );
  }

  render() {
    const { updateUser, history } = this.props;
    const { user } = this.state;
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
                    }).then(() => history.push("/users"));
                  }}
                />
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
    updateUser: user => dispatch(usersActions.update(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditUserPage);
