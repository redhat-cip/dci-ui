import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { addDuration } from "./jobStatesActions";
import JobStateFile from "./JobStateFile";
import {
  JobStates,
  JobStateRow,
  JobStatePre,
  FileContent,
  RawLogRow,
  RawLogButton,
  Label,
  SuccessLabel,
  FailureLabel,
  ErrorLabel,
  LabelBox,
} from "./JobStateComponents";
import { EmptyState } from "ui";
import { getFileContent } from "jobs/files/filesActions";

export class JobStatesList extends Component {
  state = {
    hash: null,
    seeRawLog: false,
    loadingRawLog: false,
    rawLog: "",
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

  getLabel = (jobstate) => {
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
    const { hash, seeRawLog, rawLog, loadingRawLog } = this.state;
    const { job, location, getFileContent } = this.props;
    const rawLogFile = job.files.find(
      (f) => f.name.toLowerCase() === "ansible.log"
    );
    if (isEmpty(job.jobstates))
      return (
        <EmptyState title="No logs" info="There is no logs for this job" />
      );
    return (
      <JobStates>
        {rawLogFile && (
          <RawLogRow>
            <RawLogButton
              variant="tertiary"
              isSmall
              onClick={() => {
                this.setState({ loadingRawLog: true });
                getFileContent(rawLogFile)
                  .then((r) => {
                    this.setState((prevState) => ({
                      rawLog: r.data,
                      seeRawLog: !prevState.seeRawLog,
                    }));
                  })
                  .catch(console.log)
                  .then(this.setState({ loadingRawLog: false }));
              }}
            >
              {loadingRawLog
                ? "Loading"
                : seeRawLog
                ? "Hide Raw log"
                : "Raw Log"}
            </RawLogButton>
          </RawLogRow>
        )}
        {seeRawLog && !loadingRawLog ? (
          <div>
            <FileContent>
              <JobStatePre>{rawLog}</JobStatePre>
            </FileContent>
          </div>
        ) : (
          addDuration(job.jobstates).map((jobstate, i) => (
            <div key={i}>
              {jobstate.files.length === 0 ? null : (
                <JobStateRow>
                  <LabelBox>{this.getLabel(jobstate)}</LabelBox>
                  <LabelBox>
                    <Label>{`${Math.round(jobstate.duration)}s`}</Label>
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
          ))
        )}
      </JobStates>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFileContent: (file) => dispatch(getFileContent(file)),
  };
}

export default connect(null, mapDispatchToProps)(JobStatesList);
