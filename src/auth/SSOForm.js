import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup
} from "@patternfly/react-core";

export class SSOForm extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div>
        <ActionGroup>
          <Toolbar>
            <ToolbarGroup>
              <Button
                variant="danger"
                className="pf-u-mt-md"
                onClick={() => {
                  auth.signinRedirect();
                }}
              >
                Log in
              </Button>
            </ToolbarGroup>
          </Toolbar>
        </ActionGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(SSOForm);
