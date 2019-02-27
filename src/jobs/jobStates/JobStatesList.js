import React, { Component } from "react";
import { isEmpty } from "lodash";
import { addDuration } from "./jobStatesActions";
import JobStateFile from "./JobStateFile";
import {
  JobStates,
  JobStateRow,
  Label,
  SuccessLabel,
  FailureLabel,
  ErrorLabel,
  DurationLabel
} from "./JobStateComponents";
import { EmptyState } from "ui";

export default class JobStatesList extends Component {
  getLabel = jobstate => {
    switch (jobstate.status) {
      case "success":
        return <SuccessLabel>{jobstate.status}</SuccessLabel>;
      case "failure":
        return <FailureLabel>{jobstate.status}</FailureLabel>;
      case "error":
        return <ErrorLabel>{jobstate.status}</ErrorLabel>;
      default:
        return <Label>{jobstate.status}</Label>;
    }
  };

  render() {
    const { jobstates } = this.props;
    if (isEmpty(jobstates))
      return (
        <EmptyState title="No logs" info="There is no logs for this job" />
      );
    return (
      <JobStates>
        {addDuration(jobstates).map((jobstate, i) => (
          <div key={i}>
            {jobstate.files.length === 0 ? null : (
              <JobStateRow>
                {this.getLabel(jobstate)}
                <DurationLabel duration={jobstate.duration} />
              </JobStateRow>
            )}
            {jobstate.files.map((file, i) => (
              <JobStateFile key={i} file={file} />
            ))}
          </div>
        ))}
      </JobStates>
    );
  }
}
