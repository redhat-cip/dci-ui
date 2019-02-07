import React, { Component } from "react";
import styled from "styled-components";
import { Bullseye } from "@patternfly/react-core";
import { BlinkLogo } from "../ui";

const FullHeightDiv = styled.div`
  height: 100vh;
`;

export default class LoadingContainer extends Component {
  render() {
    return (
      <FullHeightDiv>
        <Bullseye>
          <BlinkLogo />
        </Bullseye>
      </FullHeightDiv>
    );
  }
}
