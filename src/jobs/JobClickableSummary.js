import React, { Component } from "react";
import styled from "styled-components";
import { Colors, Labels } from "../ui";

function getBackground(status, backgroundColor = Colors.white) {
  switch (status) {
    case "success":
      return `linear-gradient(to right,${Colors.green400} 0,${
        Colors.green400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "failure":
    case "error":
      return `linear-gradient(to right,${Colors.red} 0,${
        Colors.red
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "killed":
      return `linear-gradient(to right,${Colors.orange400} 0,${
        Colors.orange400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    default:
      return `linear-gradient(to right,${Colors.blue400} 0,${
        Colors.blue400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
  }
}

const Job = styled.div`
  width: 100%;
  box-shadow: 0 1px 1px rgba(3, 3, 3, 0.175);
  background: ${props => getBackground(props.status)};
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (min-width: 720px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 75px;
  }

  span {
    display: inline-block;
    margin: 0;
  }
`;

const JobClickable = styled(Job)`
  cursor: pointer;
  &:hover {
    background: ${props => getBackground(props.status, Colors.black200)};
  }
`;

const JobInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;

  @media only screen and (min-width: 720px) {
    width: 288px;
    padding: 1em;
  }
`;

const JobIcon = styled.div`
  width: 40px;
  text-align: center;
  margin-right: 1em;
`;

const JobTests = styled.div`
  padding: 1em;
  padding-top: 0;
  display: none;

  @media only screen and (min-width: 480px) {
    display: flex;
    flex-direction: column;
  }

  @media only screen and (min-width: 720px) {
    padding: 1em;
  }
`;

const JobNames = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobExtraInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  padding-top: 0;

  @media only screen and (min-width: 720px) {
    width: 180px;
    margin-left: auto;
    padding: 1em;
  }
`;

function getIcon(job) {
  switch (job.status) {
    case "success":
      return (
        <i
          className="fa fa-fw fa-2x fa-check-circle"
          style={{ color: Colors.green400 }}
        />
      );
    case "failure":
    case "error":
      return (
        <i
          className="fa fa-fw fa-2x fa-exclamation-circle"
          style={{ color: Colors.red }}
        />
      );
    case "killed":
      return (
        <i
          className="fa fa-fw fa-2x fa-stop-circle"
          style={{ color: Colors.orange400 }}
        />
      );
    default:
      return (
        <i
          className="fa fa-fw fa-2x fa-pause-circle"
          style={{ color: Colors.blue400 }}
        />
      );
  }
}

function InnerJob({ job }) {
  return (
    <React.Fragment>
      <JobInfo>
        <JobIcon>{getIcon(job)}</JobIcon>
        <JobNames>
          <span>
            <b>{job.topic.name}</b>
          </span>
          {job.components.map((component, i) => (
            <span key={i}>{component.name}</span>
          ))}
          <span>{job.remoteci.name}</span>
          {job.rconfiguration && job.rconfiguration.name ? (
            <span>{job.rconfiguration.name}</span>
          ) : null}
          <span>
            {job.metas.map((meta, i) => (
              <span key={i} className="label label-primary mr-1">
                {meta.name}
              </span>
            ))}
          </span>
        </JobNames>
      </JobInfo>
      <JobTests>
        {job.results.map((test, i) => (
          <div key={i}>
            <span className="label label-success mr-1">{test.success}</span>
            <span className="label label-warning mr-1">{test.skips}</span>
            <span className="label label-danger mr-1">
              {test.errors + test.failures}
            </span>
            {test.regressions ? (
              <Labels.Regression>{test.regressions}</Labels.Regression>
            ) : null}
            <span>{test.name}</span>
          </div>
        ))}
      </JobTests>
      {job.from_now && job.duration ? (
        <JobExtraInfo>
          <span>
            <i className="fa fa-fw fa-calendar mr-1" />
            {job.from_now}
          </span>
          <span>
            <i className="fa fa-fw fa-clock-o mr-1" />
            Ran for <b>{job.duration}</b>
          </span>
        </JobExtraInfo>
      ) : null}
    </React.Fragment>
  );
}

export default class JobClickableSummary extends Component {
  render() {
    const { job, history } = this.props;
    if (typeof job.id === "undefined") return null;
    return (
      <JobClickable
        status={job.status}
        onClick={() => history.push(`/jobs/${job.id}/jobStates`)}
      >
        <InnerJob job={job} />
      </JobClickable>
    );
  }
}

export class JobSummary extends Component {
  render() {
    const { job } = this.props;
    if (typeof job.id === "undefined") return null;
    return (
      <Job status={job.status}>
        <InnerJob job={job} />{" "}
      </Job>
    );
  }
}
