import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import Issue from "./Issue";
import NewIssueButton from "./NewIssueButton";
import { ThumbsUpIcon } from "@patternfly/react-icons";

export default class IssuesList extends Component {
  render() {
    const { issues, createIssue, deleteIssue } = this.props;
    if (isEmpty(issues))
      return (
        <EmptyState
          icon={<ThumbsUpIcon size="lg" />}
          title="No issues"
          info="There is no issues for this job"
        />
      );
    return (
      <div className="IssuesList">
        <NewIssueButton createIssue={createIssue} />
        {issues.map((issue, i) => (
          <Issue key={i} deleteIssue={deleteIssue} issue={issue} />
        ))}
      </div>
    );
  }
}
