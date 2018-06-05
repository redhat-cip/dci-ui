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
import { connectWithStore } from "../store";
import objectValues from "object.values";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "patternfly-react";

import Alert from "../Components/Alert";
import LoadingContainer from "../Components/Loading/LoadingContainer";
import JobSummary from "../Components/Jobs/JobSummary";
import { MainContent } from "../Components/Layout";
import { fetchJobs } from "../Components/Jobs/actions";

export class JobsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchJobs();
  }

  render() {
    const { isFetching, errorMessage, byId } = this.props.jobs;
    const jobs = objectValues(byId);
    return (
      <MainContent>
        {errorMessage && !jobs.length ? <Alert message={errorMessage} /> : null}
        <Grid fluid>
          <Row>
            <Col xs={12} md={8}>
              {isFetching && !jobs.length ? <LoadingContainer /> : null}
              {jobs.map((job, i) => <JobSummary key={i} job={job} />)}
            </Col>
            <Col xs={12} md={4} />
          </Row>
        </Grid>
      </MainContent>
    );
  }
}

JobsScreen.propTypes = {
  jobs: PropTypes.object,
  fetchJobs: PropTypes.func
};

function mapStateToProps(state) {
  return {
    jobs: state.jobs2
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: () => {
      dispatch(fetchJobs());
    }
  };
}

export default connectWithStore(
  JobsScreen,
  mapStateToProps,
  mapDispatchToProps
);
