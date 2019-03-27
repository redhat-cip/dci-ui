import React, { Component } from "react";
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
import { getIssues, createIssue, deleteIssue } from "./issues/issuesActions";
import JobSummary from "./JobSummary";

const HeaderSection = styled(PageSection)`
  padding-bottom: 0 !important;
`;

export class JobPage extends Component {
  state = {
    job: {
      tests: [],
      jobstates: [],
      issues: [],
      files: []
    },
    isFetching: true,
    tabIndex: 0
  };

  componentDidMount() {
    const { match, fetchJob, getResults, getJobStates, getIssues } = this.props;
    const { id, tab } = match.params;
    fetchJob(id)
      .then(response => {
        const job = response.data.job;
        return Promise.all([
          getResults(job),
          getJobStates(job),
          getIssues(job)
        ]).then(values => {
          this.setState({
            job: {
              ...job,
              tests: values[0].data.results,
              jobstates: values[1].data.jobstates,
              issues: values[2].data.issues
            },
            tab
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
    const { history } = this.props;
    const { job, isFetching, tabIndex } = this.state;
    const tabs = { 0: "Logs", 1: "Tests", 2: "Issues", 3: "Files" };
    const tabItems = Object.values(tabs).map((tab, i) => (
      <li className={`pf-c-tabs__item ${tabIndex === i ? "pf-m-current" : ""}`}>
        <button
          className="pf-c-tabs__button"
          id={`job-details-nav-${tab}`}
          aria-controls={`${tab}-section`}
          onClick={() => this.setState({ tabIndex: i })}
        >
          {tab}
        </button>
      </li>
    ));
    return (
      <Page
        HeaderSection={
          <HeaderSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">{tabs[tabIndex]}</Text>
            </TextContent>
            <div className="pf-c-tabs" aria-label="Job details navigation">
              <ul className="pf-c-tabs__list">{tabItems}</ul>
            </div>
          </HeaderSection>
        }
        loading={isFetching}
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
            {tabIndex === 0 && <JobStatesList jobstates={job.jobstates} />}
            {tabIndex === 1 && <TestsList tests={job.tests} />}
            {tabIndex === 2 && (
              <IssuesList
                issues={job.issues}
                createIssue={this.createIssue}
                deleteIssue={this.deleteIssue}
              />
            )}
            {tabIndex === 3 && <FilesList files={job.files} />}
          </div>
        </div>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJob: id =>
      dispatch(
        jobsActions.one(
          { id },
          {
            embed: "results,team,remoteci,components,topic,rconfiguration,files"
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
  null,
  mapDispatchToProps
)(JobPage);
