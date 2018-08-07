import React, { Component } from "react";
import IssueForm from "./IssueForm";

export default class NewIssueButton extends Component {
  render() {
    const { createIssue } = this.props;
    return (
      <IssueForm
        title="Create a new issue"
        showModalButton="Create a new issue"
        okButton="Create"
        submit={createIssue}
      />
    );
  }
}
