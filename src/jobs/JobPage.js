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
  TabTitleText,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import styled from "styled-components";
import FilesList from "./files/FilesList";
import TestsList from "./tests/TestsList";
import JobStatesList from "./jobStates/JobStatesList";
import jobsActions from "./jobsActions";
import { getResults } from "./tests/testsActions";
import { getJobStatesWithFiles } from "./jobStates/jobStatesActions";
import { enhanceJob } from "./jobsSelectors";
import JobSummary from "./JobSummary";

const HeaderSection = styled(PageSection)`
  padding-bottom: 0 !important;
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
      { title: "Files", value: "files" },
    ],
  };

  componentDidMount() {
    const { match, fetchJob, getResults, getJobStates } = this.props;
    const { endpoints } = this.state;
    const { id, endpoint } = match.params;
    const activeTabKey = endpoints.findIndex((e) => e.value === endpoint);
    fetchJob(id)
      .then((response) => {
        const job = response.data.job;
        return Promise.all([getResults(job), getJobStates(job)]).then(
          (results) => {
            const enhancedJob = enhanceJob({
              ...job,
              tests: results[0].data.results,
              jobstates: results[1].data.jobstates,
            });
            this.setState({
              job: enhancedJob,
              activeTabKey,
            });
          }
        );
      })
      .catch((error) => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }

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
                      title={<TabTitleText>{endpoints[i].title}</TabTitleText>}
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
            <JobSummary job={job} />
          </StackItem>
          <StackItem>
            {activeTabKey === 0 && (
              <JobStatesList job={job} location={location} />
            )}
            {activeTabKey === 1 && <TestsList tests={job.tests} />}
            {activeTabKey === 2 && <FilesList files={job.files} />}
          </StackItem>
        </Stack>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJob: (id) =>
      dispatch(
        jobsActions.one(
          { id },
          {
            embed: "results,team,remoteci,components,topic,files",
          }
        )
      ),
    getResults: (job) => dispatch(getResults(job)),
    getJobStates: (job) => dispatch(getJobStatesWithFiles(job)),
  };
}

export default connect(null, mapDispatchToProps)(JobPage);
