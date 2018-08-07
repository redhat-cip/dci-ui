import React, { Component } from "react";
import _ from "lodash";
import { EmptyState } from "../../ui";
import Issue from "./Issue";
import NewIssueButton from "./NewIssueButton";
export default class IssuesList extends Component {
  render() {
    const { issues, createIssue, deleteIssue } = this.props;
    if (_.isEmpty(issues))
      return (
        <EmptyState
          title="No issues"
          info="There is no issues for this job"
          button={<NewIssueButton createIssue={createIssue} />}
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
