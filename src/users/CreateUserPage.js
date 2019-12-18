import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { Page } from "layout";
import usersActions from "./usersActions";
import UserForm from "./UserForm";

export class CreateUserPage extends Component {
  render() {
    const { createUser, history } = this.props;
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
    createUser: user => dispatch(usersActions.create(user))
  };
}

export default connect(null, mapDispatchToProps)(CreateUserPage);
