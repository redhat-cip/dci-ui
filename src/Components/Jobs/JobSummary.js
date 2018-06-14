// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
import React from "react";
import styled from "styled-components";
import { colors } from "../../styles";
import { connect } from "../../store";
import * as date from "../Date";

const JobSummary = styled.div`
  border: 1px solid ${colors.black200};
  padding: 1em;
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;

  @media (min-width: 780px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &:hover {
    background-color: ${colors.black100};
    cursor: pointer;
  }
`;

const JobSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  min-width: 200px;

  @media (min-width: 780px) {
    margin-bottom: 0;
  }
`;

const JobSummaryIcon = styled.div`
  margin-right: 0.5em;
`;

const JobItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobSummaryTests = styled.div`
  margin-bottom: 1em;
  overflow: hidden;
  a {
    margin-left: 0.5em;
  }
  @media (min-width: 780px) {
    margin-bottom: 0;
  }
`;

const JobSummaryTest = styled.div`
  display: flex;
  align-items: center;
`;

const JobSummaryExtraInfo = styled.div`
  min-width: 170px;
`;

const TestNumber = styled.span`
  margin: 0 0.7em 0 0.5em;
  min-width: 30px;
  text-align: center;
`;

const Dot = styled.span`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
`;

const DotSuccess = Dot.extend`
  background-color: ${colors.green300};
`;

const DotSkipped = Dot.extend`
  background-color: ${colors.orange300};
`;

const DotError = Dot.extend`
  background-color: ${colors.red300};
`;

const JobDate = JobItem.extend`
  text-transform: lowercase;
  flex-basis: 150px;
`;

function getIcon(job) {
  switch (job.status) {
    case "success":
      return (
        <i
          className="fa fa-fw fa-2x fa-check-circle"
          style={{ color: colors.green400 }}
        />
      );
    case "failure":
    case "error":
      return (
        <i
          className="fa fa-fw fa-2x fa-exclamation-circle"
          style={{ color: colors.red }}
        />
      );
    case "killed":
      return (
        <i
          className="fa fa-fw fa-2x fa-stop-circle"
          style={{ color: colors.orange400 }}
        />
      );
    default:
      return (
        <i
          className="fa fa-fw fa-2x fa-pause-circle"
          style={{ color: colors.blue400 }}
        />
      );
  }
}

export function JobSummaryContainer({ job }) {
  if (!job || !job.remoteci) return null;
  return (
    <JobSummary>
      <JobSummaryHeader>
        <JobSummaryIcon>{getIcon(job)}</JobSummaryIcon>
        <JobItem>
          <a href={`/jobs/${job.id}/jobStates`}>{job.remoteci.name}</a>
          <span>{job.topic.name}</span>
          {job.rconfiguration && job.rconfiguration.name ? (
            <span>{job.rconfiguration.name}</span>
          ) : null}
          {job.components.map((component, i) => (
            <span key={i}>{component.name}</span>
          ))}
        </JobItem>
      </JobSummaryHeader>
      <JobSummaryTests>
        {job.results.map((test, i) => (
          <JobSummaryTest key={i}>
            <DotSuccess />
            <TestNumber>{test.success}</TestNumber>
            <DotSkipped />
            <TestNumber>{test.skips}</TestNumber>
            <DotError />
            <TestNumber>{test.failures + test.errors}</TestNumber>
            <span>{test.name}</span>
          </JobSummaryTest>
        ))}
      </JobSummaryTests>
      <JobSummaryExtraInfo>
        <JobDate>
          <span>{job.created_at}</span>
          <span>
            Ran for <b>{job.duration}</b>
          </span>
        </JobDate>
      </JobSummaryExtraInfo>
    </JobSummary>
  );
}

function enhanceJob(job, state) {
  if (!job) return null;
  return {
    ...job,
    created_at: date.fromNow(job.created_at, state.currentUser.timezone),
    duration: date.duration(job.created_at, job.updated_at)
  };
}

function mapStateToProps(state, ownProps) {
  return {
    job: enhanceJob(ownProps.job, state)
  };
}

export default connect(mapStateToProps)(JobSummaryContainer);
