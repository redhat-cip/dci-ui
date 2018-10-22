import React, { Component } from "react";

export default class Issue extends Component {
  render() {
    const { issue, deleteIssue } = this.props;
    return (
      <div className="issue">
        <h3>
          <button
            className="btn btn-danger pull-right"
            onClick={() => deleteIssue(issue)}
          >
            <span className="fa fa-trash" />
          </button>
          <a href={issue.url} target="_blank" rel="noopener noreferrer">
            {issue.title}
          </a>
        </h3>
        <table className="table">
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
