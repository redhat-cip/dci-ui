import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridItem } from "@patternfly/react-core";
import { updateCurrentUser } from "../currentUserActions";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Page } from "layout";

export class SettingsPage extends Component {
  render() {
    const { currentUser, updateCurrentUser } = this.props;
    return (
      <Page title="User preferences">
        <Grid gutter="md">
          <GridItem span={6}>
            <SettingsForm
              key={`SettingsForm.${currentUser.id}.${currentUser.etag}`}
              currentUser={currentUser}
              submit={(newCurrentUser) => updateCurrentUser(newCurrentUser)}
            />
          </GridItem>
          {currentUser.isReadOnly ? null : (
            <GridItem span={6}>
              <ChangePasswordForm
                key={`ChangePasswordForm.${currentUser.id}.${currentUser.etag}`}
                currentUser={currentUser}
                submit={(newCurrentUser) => {
                  updateCurrentUser(newCurrentUser);
                }}
              />
            </GridItem>
          )}
        </Grid>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: (currentUser) =>
      dispatch(updateCurrentUser(currentUser)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
