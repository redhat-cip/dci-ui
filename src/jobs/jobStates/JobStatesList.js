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
  LabelBox
} from "./JobStateComponents";
import { EmptyState } from "ui";

export default class JobStatesList extends Component {
  state = {
    hash: null
  };

  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    this.setState({ hash });
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const hash = location.hash;
    if (hash !== prevProps.location.hash) {
      this.setState({ hash });
    }
  }

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
    const { hash } = this.state;
    const { jobstates, location } = this.props;
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
                <LabelBox>{this.getLabel(jobstate)}</LabelBox>
                <LabelBox>
                  <Label>{`${jobstate.duration}s`}</Label>
                </LabelBox>
              </JobStateRow>
            )}
            {jobstate.files.map((file, j) => {
              const h = `${jobstate.id}:file${j}`;
              return (
                <JobStateFile
                  id={h}
                  key={j}
                  file={file}
                  isSelected={hash === `#${h}`}
                  link={`${location.pathname}#${h}`}
                />
              );
            })}
          </div>
        ))}
      </JobStates>
    );
  }
}
