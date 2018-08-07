import React, { Component } from "react";
import { Card, CardHeading, CardTitle, CardBody } from "patternfly-react";
import { BlinkLogo } from "./ui";

export default class DCICard extends Component {
  render() {
    const {
      HeaderButton,
      title,
      loading,
      empty,
      EmptyComponent,
      children,
      ...props
    } = this.props;
    return (
      <Card {...props}>
        <CardHeading>
          {HeaderButton}
          <CardTitle>{title}</CardTitle>
        </CardHeading>
        <CardBody className={loading ? "text-center" : ""}>
          {loading ? <BlinkLogo /> : null}
          {!loading && empty ? EmptyComponent : null}
          {!loading && !empty ? children : null}
        </CardBody>
      </Card>
    );
  }
}
