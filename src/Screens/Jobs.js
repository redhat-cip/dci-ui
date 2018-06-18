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
import { connect } from "../store";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "patternfly-react";
import { denormalize } from "normalizr";

import Alert from "../Components/Alert";
import LoadingContainer from "../Components/Loading/LoadingContainer";
import JobSummary from "../Components/Jobs/JobSummary";
import { MainContent } from "../Components/Layout";
import jobsActions from "../Components/Jobs/actions";
import { jobs as jobsSchema } from "../Components/api/schema";

export class JobsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchJobs();
  }

  render() {
    const state = this.props.state;
    const { isFetching, errorMessage } = state.jobs2;
    const jobs = denormalize(state.jobs2.allIds, jobsSchema, {
      jobs: state.jobs2.byId,
      topics: state.topics2.byId,
      remotecis: state.remotecis2.byId,
      jobstates: state.jobstates2.byId,
      results: state.results2.byId,
      components: state.components2.byId,
      rconfigurations: state.rconfigurations2.byId
    });

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
  state: PropTypes.object,
  fetchJobs: PropTypes.func
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: () => {
      dispatch(
        jobsActions.all({
          embed: "remoteci,topic,components,rconfiguration,results",
          limit: 40,
          offset: 0
        })
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsScreen);
