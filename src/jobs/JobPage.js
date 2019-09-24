import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { connect } from "react-redux";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text
} from "@patternfly/react-core";
import styled from "styled-components";
import FilesList from "./files/FilesList";
import IssuesList from "./issues/IssuesList";
import TestsList from "./tests/TestsList";
import JobStatesList from "./jobStates/JobStatesList";
import jobsActions from "./jobsActions";
import { getResults } from "./tests/testsActions";
import { getJobStatesWithFiles } from "./jobStates/jobStatesActions";
import { enhanceJob } from "./jobsSelectors";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getIssues, createIssue, deleteIssue } from "./issues/issuesActions";
import JobSummary from "./JobSummary";

const HeaderSection = styled(PageSection)`
  padding-bottom: 0 !important;
`;

export class JobPage extends Component {
  state = {
    job: {},
    isFetching: true,
    currentEndpoint: "jobStates",
    fileIndex: 0
  };

  componentDidMount() {
    const {
      match,
      fetchJob,
      getResults,
      getJobStates,
      getIssues,
      timezone
    } = this.props;
    const { id, endpoint } = match.params;
    fetchJob(id)
      .then(response => {
        const job = response.data.job;
        return Promise.all([
          getResults(job),
          getJobStates(job),
          getIssues(job)
        ]).then(results => {
          const enhancedJob = enhanceJob(
            {
              ...job,
              tests: results[0].data.results,
              jobstates: results[1].data.jobstates,
              issues: results[2].data.issues
            },
            timezone
          );
          this.setState({
            job: enhancedJob,
            currentEndpoint: endpoint
          });
        });
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }

  createIssue = issue => {
    const { createIssue } = this.props;
    createIssue(this.state.job, issue).then(response => {
      const newIssue = response.data.issue;
      this.setState(prevState => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.reduce(
              (accumulator, issue) => {
                accumulator.push(issue);
                return accumulator;
              },
              [newIssue]
            )
          }
        };
      });
    });
  };

  deleteIssue = issue => {
    const { deleteIssue } = this.props;
    deleteIssue(this.state.job, issue).then(() =>
      this.setState(prevState => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.filter(i => i.id !== issue.id)
          }
        };
      })
    );
  };

  render() {
    const { history, location } = this.props;
    const { job, isFetching, currentEndpoint } = this.state;
    const endpoints = ["jobStates", "tests", "issues", "files"];
    const endpointsTitles = {
      jobStates: "Logs",
      tests: "Tests",
      issues: "Issues",
      files: "Files"
    };
    const Menu = endpoints.map(endpoint => (
      <li
        key={endpoint}
        className={`pf-c-tabs__item ${
          endpoint === currentEndpoint ? "pf-m-current" : ""
        }`}
      >
        <button
          className="pf-c-tabs__button"
          id={`job-details-nav-${endpoint}`}
          aria-controls={`${endpoint}-section`}
          onClick={() =>
            this.setState(
              { currentEndpoint: endpoint },
              history.push(`/jobs/${job.id}/${endpoint}`)
            )
          }
        >
          {endpointsTitles[endpoint]}
        </button>
      </li>
    ));
    const currentEndpointIndex = endpoints.indexOf(currentEndpoint);
    const loading = isFetching && isEmpty(job);
    return (
      <Page
        HeaderSection={
          !loading && (
            <HeaderSection variant={PageSectionVariants.light}>
              <TextContent>
                <Text component="h1">{endpointsTitles[currentEndpoint]}</Text>
              </TextContent>
              <div className="pf-c-tabs" aria-label="Job details navigation">
                <ul className="pf-c-tabs__list">{Menu}</ul>
              </div>
            </HeaderSection>
          )
        }
        loading={loading}
      >
        <div className="pf-l-stack pf-m-gutter">
          <div className="pf-l-stack__item">
            <ul
              className="pf-c-data-list pf-u-box-shadow-md"
              aria-label="job detail"
            >
              <JobSummary job={job} history={history} />
            </ul>
          </div>
          <div className="pf-l-stack__item pf-m-main">
            {currentEndpointIndex === 0 && (
              <JobStatesList jobstates={job.jobstates} location={location} />
            )}
            {currentEndpointIndex === 1 && <TestsList tests={job.tests} />}
            {currentEndpointIndex === 2 && (
              <IssuesList
                issues={job.issues}
                createIssue={this.createIssue}
                deleteIssue={this.deleteIssue}
              />
            )}
            {currentEndpointIndex === 3 && <FilesList files={job.files} />}
          </div>
        </div>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    timezone: getTimezone(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJob: id =>
      dispatch(
        jobsActions.one(
          { id },
          {
            embed: "results,team,remoteci,components,topic,files,tags"
          }
        )
      ),
    getResults: job => dispatch(getResults(job)),
    getJobStates: job => dispatch(getJobStatesWithFiles(job)),
    getIssues: job => dispatch(getIssues(job)),
    createIssue: (job, issue) => dispatch(createIssue(job, issue)),
    deleteIssue: (job, issue) => dispatch(deleteIssue(job, issue))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPage);
