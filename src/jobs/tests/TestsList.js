import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import Test from "./Test";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

export default class TestsList extends Component {
  render() {
    const { tests } = this.props;
    if (isEmpty(tests))
      return (
        <EmptyState title="No tests" info="There is no tests for this job" />
      );
    return (
      <PageSection variant={PageSectionVariants.light}>
        {tests.map((test, i) => (
          <Test key={i} test={test} />
        ))}
      </PageSection>
    );
  }
}
