import React, { Component } from "react";
import {
  Nav,
  NavItem,
  Card,
  CardBody,
  TabContent,
  TabPane,
  TabContainer,
  ListView
} from "patternfly-react";
import { MainContentWithLoader } from "../layout";
import { connect } from "react-redux";
import FilesList from "./files/FilesList";
import IssuesList from "./issues/IssuesList";
import TestsList from "./tests/TestsList";
import JobStatesList from "./jobStates/JobStatesList";
import jobsActions from "./jobsActions";
import { getResults } from "./tests/testsActions";
import { getFilesWithJobStates } from "./files/filesActions";
import { getIssues, createIssue, deleteIssue } from "./issues/issuesActions";
import JobSummary from "./JobSummary";

export class JobContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: {
        tests: [],
        jobstates: [],
        issues: [],
        files: []
      },
      isFetching: true
    };
  }

  componentDidMount() {
    const { match, getResults, getFiles, getIssues, fetchJob } = this.props;
    fetchJob(match.params.id)
      .then(response => {
        const job = response.data.job;
        return Promise.all([
          getResults(job),
          getFiles(job),
          getIssues(job)
        ]).then(values => {
          this.setState({
            job: {
              ...job,
              tests: values[0].data.results,
              files: values[1].data.files,
              issues: values[2].data.issues
            }
          });
        });
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }

  createIssue = issue => {
    this.props.createIssue(this.state.job, issue).then(response => {
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
    this.props.deleteIssue(this.state.job, issue).then(() =>
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
    const { match, history } = this.props;
    const { job, isFetching } = this.state;
    const { id, tab } = match.params;
    const tabsIndexes = {
      jobStates: 1,
      tests: 2,
      issues: 3,
      files: 4
    };
    return (
      <MainContentWithLoader loading={isFetching}>
        <ListView>
          <JobSummary seeDetails job={job} history={history} />
        </ListView>
        <TabContainer id="basic-tabs" defaultActiveKey={tabsIndexes[tab]}>
          <React.Fragment>
            <Nav bsClass="nav nav-tabs">
              <NavItem
                onClick={() => history.push(`/jobs/${id}/jobStates`)}
                eventKey={1}
              >
                Logs
              </NavItem>
              <NavItem
                onClick={() => history.push(`/jobs/${id}/tests`)}
                eventKey={2}
              >
                Tests
              </NavItem>
              <NavItem
                onClick={() => history.push(`/jobs/${id}/issues`)}
                eventKey={3}
              >
                Issues
              </NavItem>
              <NavItem
                onClick={() => history.push(`/jobs/${id}/files`)}
                eventKey={4}
              >
                Files
              </NavItem>
            </Nav>
            <TabContent>
              <TabPane eventKey={1}>
                <Card>
                  <CardBody>
                    <JobStatesList files={job.files} />
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane eventKey={2}>
                <Card>
                  <CardBody>
                    <TestsList tests={job.tests} />
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane eventKey={3}>
                <Card>
                  <CardBody>
                    <IssuesList
                      issues={job.issues}
                      createIssue={this.createIssue}
                      deleteIssue={this.deleteIssue}
                    />
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane eventKey={4}>
                <Card>
                  <CardBody>
                    <FilesList files={job.files} />
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </React.Fragment>
        </TabContainer>
      </MainContentWithLoader>
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
            embed: "results,team,remoteci,components,metas,topic,rconfiguration"
          }
        )
      ),
    getResults: job => dispatch(getResults(job)),
    getFiles: job => dispatch(getFilesWithJobStates(job)),
    getIssues: job => dispatch(getIssues(job)),
    createIssue: (job, issue) => dispatch(createIssue(job, issue)),
    deleteIssue: (job, issue) => dispatch(deleteIssue(job, issue))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(JobContainer);
