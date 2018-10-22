import React, { Component } from "react";
import { SadTearIcon } from "@patternfly/react-icons";
import {
  TextContent,
  Text,
  TextVariants,
  Bullseye
} from "@patternfly/react-core";

export default class EmptyState extends Component {
  render() {
    const { title, info } = this.props;
    return (
      <Bullseye>
        <TextContent className="pf-u-text-align-center">
          <SadTearIcon size="lg" />
          <Text component={TextVariants.h1}>{title}</Text>
          <Text component={TextVariants.h3}>{info}</Text>
        </TextContent>
      </Bullseye>
    );
  }
}
