import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { connect } from "react-redux";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Tabs,
  Tab,
  Stack,
  StackItem,
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
import { JobSummary } from "./JobsList";

const HeaderSection = styled(PageSection)`
  padding-bottom: 0 !important;
`;

const JobDetails = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  background-color: white;
`;

export class JobPage extends Component {
  state = {
    job: {},
    isFetching: true,
    activeTabKey: 0,
    fileIndex: 0,
    endpoints: [
      { title: "Logs", value: "jobStates" },
      { title: "Tests", value: "tests" },
      { title: "Issues", value: "issues" },
      { title: "Files", value: "files" },
    ],
  };

  componentDidMount() {
    const {
      match,
      fetchJob,
      getResults,
      getJobStates,
      getIssues,
      timezone,
    } = this.props;
    const { endpoints } = this.state;
    const { id, endpoint } = match.params;
    const activeTabKey = endpoints.findIndex((e) => e.value === endpoint);
    fetchJob(id)
      .then((response) => {
        const job = response.data.job;
        return Promise.all([
          getResults(job),
          getJobStates(job),
          getIssues(job),
        ]).then((results) => {
          const enhancedJob = enhanceJob(
            {
              ...job,
              tests: results[0].data.results,
              jobstates: results[1].data.jobstates,
              issues: results[2].data.issues,
            },
            timezone
          );
          this.setState({
            job: enhancedJob,
            activeTabKey,
          });
        });
      })
      .catch((error) => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }

  createIssue = (issue) => {
    const { createIssue } = this.props;
    createIssue(this.state.job, issue).then((response) => {
      const newIssue = response.data.issue;
      this.setState((prevState) => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.reduce(
              (accumulator, issue) => {
                accumulator.push(issue);
                return accumulator;
              },
              [newIssue]
            ),
          },
        };
      });
    });
  };

  deleteIssue = (issue) => {
    const { deleteIssue } = this.props;
    deleteIssue(this.state.job, issue).then(() =>
      this.setState((prevState) => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.filter((i) => i.id !== issue.id),
          },
        };
      })
    );
  };

  render() {
    const { history, location } = this.props;
    const { job, isFetching, activeTabKey, endpoints } = this.state;
    const loading = isFetching && isEmpty(job);
    return (
      <Page
        HeaderSection={
          !loading && (
            <HeaderSection variant={PageSectionVariants.light}>
              <TextContent>
                <Text component="h1">{endpoints[activeTabKey].title}</Text>
              </TextContent>
              <div className="pf-c-tabs" aria-label="Job details navigation">
                <Tabs
                  activeKey={activeTabKey}
                  onSelect={(event, tabIndex) => {
                    this.setState(
                      { activeTabKey: tabIndex },
                      history.push(
                        `/jobs/${job.id}/${endpoints[tabIndex].value}`
                      )
                    );
                  }}
                >
                  {endpoints.map((endpoint, i) => (
                    <Tab
                      key={endpoint.value}
                      eventKey={i}
                      title={endpoints[i].title}
                    ></Tab>
                  ))}
                </Tabs>
              </div>
            </HeaderSection>
          )
        }
        loading={loading}
      >
        <Stack>
          <StackItem>
            <JobDetails>
              <JobSummary job={job} />
            </JobDetails>
          </StackItem>
          <StackItem>
            {activeTabKey === 0 && (
              <JobStatesList jobstates={job.jobstates} location={location} />
            )}
            {activeTabKey === 1 && <TestsList tests={job.tests} />}
            {activeTabKey === 2 && (
              <IssuesList
                issues={job.issues}
                createIssue={this.createIssue}
                deleteIssue={this.deleteIssue}
              />
            )}
            {activeTabKey === 3 && <FilesList files={job.files} />}
          </StackItem>
        </Stack>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    timezone: getTimezone(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJob: (id) =>
      dispatch(
        jobsActions.one(
          { id },
          {
            embed: "results,team,remoteci,components,topic,files,tags",
          }
        )
      ),
    getResults: (job) => dispatch(getResults(job)),
    getJobStates: (job) => dispatch(getJobStatesWithFiles(job)),
    getIssues: (job) => dispatch(getIssues(job)),
    createIssue: (job, issue) => dispatch(createIssue(job, issue)),
    deleteIssue: (job, issue) => dispatch(deleteIssue(job, issue)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobPage);
