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
import PropTypes from "prop-types";
import styled from "styled-components";
import { Icon } from "patternfly-react";
import { colors } from "../../styles";
import { connectWithStore } from "../../store";

const Job = styled.div`
  text-transform: uppercase;
  background-color: ${colors.white};
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
  min-height: 60px;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  &:hover {
    background-color: ${colors.black100};
    cursor: pointer;
  }
`;

const JobItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobStatus = JobItem.extend`
  flex-basis: 24px;
`;

const JobInfo = JobItem.extend`
  flex-basis: calc(320px - 6rem);
  margin-left: 2em;
`;

const JobTests = JobItem.extend`
  flex-grow: 1;
`;

const Test = styled.div`
  display: flex;
  align-items: center;
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

export default function JobSummary({ job, topic }) {
  return (
    <Job>
      <JobStatus>{getIcon(job)}</JobStatus>
      <JobInfo>
        <a href="#">{job.remoteci.name}</a>
        <a href="#">{job.topic.name}</a>
        {job.rconfiguration && job.rconfiguration.name ? (
          <span>{job.rconfiguration.name}</span>
        ) : null}
        {job.components.map((component, i) => (
          <span key={i}>{component.name}</span>
        ))}
      </JobInfo>
      <JobTests>
        <Test>
          <DotSuccess />
          <TestNumber>1867</TestNumber>
          <DotSkipped />
          <TestNumber>356</TestNumber>
          <DotError />
          <TestNumber>187</TestNumber>
          <span className="job__test-name">Tempest</span>
        </Test>
        <Test>
          <DotSuccess />
          <TestNumber>3</TestNumber>
          <DotSkipped />
          <TestNumber>41</TestNumber>
          <DotError />
          <TestNumber>1</TestNumber>
          <span className="job__test-name">certification</span>
        </Test>
      </JobTests>
      <JobDate>
        <span>an hour ago</span>
        <span>
          Ran for <b>29 minutes</b>
        </span>
      </JobDate>
    </Job>
  );
}
