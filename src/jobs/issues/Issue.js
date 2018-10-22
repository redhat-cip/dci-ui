import React, { Component } from "react";
import { TrashIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";

export default class Issue extends Component {
  render() {
    const { issue, deleteIssue } = this.props;
    return (
      <div className="issue">
        <h3>
          <Button
            variant="danger"
            onClick={() => deleteIssue(issue)}
          >
            <TrashIcon />
          </Button>
          <a href={issue.url} target="_blank" rel="noopener noreferrer">
            {issue.title}
          </a>
        </h3>
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <tbody>
            <tr>
              <th>Product</th>
              <td>{issue.product}</td>
              <th>Component</th>
              <td>{issue.component}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{issue.status}</td>
              <th>Bug ID</th>
              <td>{issue.issue_id}</td>
            </tr>
            <tr>
              <th>Created</th>
              <td>{issue.created_at}</td>
              <th>Last Updated</th>
              <td>{issue.updated_at}</td>
            </tr>
            <tr>
              <th>Reported</th>
              <td>{issue.reporter}</td>
              <th>Assignee</th>
              <td>{issue.assignee}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
