import React, { Component } from "react";
import { BlinkLogo } from "../ui";
import { Page, Bullseye } from "@patternfly/react-core";

export default class LoadingContainer extends Component {
  render() {
    // todo replace by MainContent
    return (
      <React.Fragment>
        <div className="pf-c-background-image" />
        <Page header={null} sidebar={null}>
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        </Page>
      </React.Fragment>
    );
  }
}
