import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ListViewItem, DropdownKebab, MenuItem, Icon } from "patternfly-react";
import { Button } from "@patternfly/react-core";
import { Colors, Labels } from "../ui";
import { formatDate, duration } from "../services/date";
import { isEmpty } from "lodash";
import jobsActions from "./jobsActions";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  PauseCircleIcon
} from "@patternfly/react-icons";

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

const Job = styled(ListViewItem)`
  border-top: 1px solid ${Colors.black300} !important;
  background: ${props => getBackground(props.status)};
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobComponents = styled.div`
  display: flex;
  flex-direction: row;
`;

const JobComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobTests = styled(JobInfo)``;

const JobTest = styled.div`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const JobExtraInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const JobDateInfo = styled(JobInfo)`
  margin-right: 1em;
`;

function getIcon(job) {
  switch (job.status) {
    case "success":
      return <CheckCircleIcon style={{ color: Colors.green400 }} />;
    case "failure":
    case "error":
      return <ExclamationCircleIcon style={{ color: Colors.red }} />;
    case "killed":
      return <StopCircleIcon style={{ color: Colors.orange400 }} />;
    default:
      return <PauseCircleIcon style={{ color: Colors.blue400 }} />;
  }
}

function getRemoteciInfo(job) {
  if (job.rconfiguration && job.rconfiguration.name) {
    return `${job.remoteci.name} (${job.rconfiguration.name})`;
  }
  return `${job.remoteci.name}`;
}

export class JobSummary extends Component {
  render() {
    const {
      enhancedJob: job,
      deleteJob,
      currentUser,
      history,
      seeDetails = false
    } = this.props;
    if (typeof job.id === "undefined") return null;
    return (
      <Job
        status={job.status}
        leftContent={getIcon(job)}
        heading={
          <JobInfo>
            <span>
              <b>{job.topic.name}</b>
            </span>
            {isEmpty(job.team) ? null : (
              <span>
                <i className="fa fa-fw fa-users pf-u-mr-xl" />
                {job.team.name}
              </span>
            )}
            <span>
              <i className="fa fa-fw fa-server pf-u-mr-xl" />
              {getRemoteciInfo(job)}
            </span>
            <span>
              {job.metas.map((meta, i) => (
                <span key={i} className="label label-primary pf-u-mr-xl">
                  {meta.name}
                </span>
              ))}
            </span>
          </JobInfo>
        }
        description={
          seeDetails ? (
            <JobComponents>
              <JobComponent>
                <Icon name="cubes" className="pf-u-mr-xl" />
              </JobComponent>
              <JobComponent>
                {job.components.map(component => (
                  <span key={component.id}>{component.name}</span>
                ))}
              </JobComponent>
            </JobComponents>
          ) : null
        }
        additionalInfo={[
          <JobTests key={`${job.id}.tests`}>
            {job.results.map(test => (
              <JobTest key={test.id}>
                <span className="label label-success pf-u-mr-xl">
                  {test.success}
                </span>
                <span className="label label-warning pf-u-mr-xl">
                  {test.skips}
                </span>
                <span className="label label-danger pf-u-mr-xl">
                  {test.errors + test.failures}
                </span>
                {test.regressions ? (
                  <Labels.Regression className="pf-u-mr-xl">
                    {test.regressions}
                  </Labels.Regression>
                ) : null}
                <small>{test.name}</small>
              </JobTest>
            ))}
          </JobTests>
        ]}
        actions={
          <JobExtraInfo>
            <JobDateInfo>
              <time dateTime={job.created_at} title={job.created_at}>
                <i className="fa fa-fw fa-calendar pf-u-mr-xl" />
                {job.datetime}
              </time>
              {job.status !== "new" && job.status !== "running" ? (
                <span title={`From ${job.created_at} to ${job.updated_at}`}>
                  <i className="fa fa-fw fa-clock-o pf-u-mr-xl" />
                  Ran for {job.duration}
                </span>
              ) : null}
            </JobDateInfo>
            {seeDetails ? null : (
              <Button onClick={() => history.push(`/jobs/${job.id}/jobStates`)}>
                See details
              </Button>
            )}
            {currentUser.hasAdminRole ? (
              <DropdownKebab id="action2kebab" pullRight>
                <MenuItem>
                  <span className="text-danger" onClick={() => deleteJob(job)}>
                    <Icon name="warning" className="pf-u-mr-xl" />
                    delete job
                  </span>
                </MenuItem>
              </DropdownKebab>
            ) : null}
          </JobExtraInfo>
        }
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { job } = ownProps;
  return {
    currentUser: state.currentUser,
    enhancedJob: {
      ...job,
      datetime: formatDate(job.created_at, state.currentUser.timezone),
      duration: duration(job.created_at, job.updated_at)
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteJob: job => {
      dispatch(jobsActions.delete(job));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobSummary);
