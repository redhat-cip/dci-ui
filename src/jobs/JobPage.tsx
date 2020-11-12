import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { useDispatch } from "react-redux";
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
import JobSummary from "./JobSummary";
import { useHistory, useParams } from "react-router-dom";
import { IEnhancedJob, ITest } from "types";
import { AppDispatch } from "store";
import { sortByName } from "services/sort";
import JobSettingsPage from "./settings/JobSettingsPage";

const HeaderSection = styled(PageSection)`
  padding-bottom: 0 !important;
`;

interface MatchParams {
  id: string;
  endpoint: string;
}

export default function JobPage() {
  const [isFetching, setIsFetching] = useState(true);
  const { id, endpoint } = useParams<MatchParams>();
  const endpoints = [
    { title: "Logs", value: "jobStates" },
    { title: "Tests", value: "tests" },
    { title: "Files", value: "files" },
    { title: "Settings", value: "settings" },
  ];
  const [activeTabKey, setActiveTabKey] = useState<number>(
    endpoints.findIndex((e) => e.value === endpoint)
  );
  const [job, setJob] = useState<IEnhancedJob | null>(null);

  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      jobsActions.one(id, {
        embed: "results,team,remoteci,components,topic,files",
      })
    )
      .then(async (response) => {
        const job = response.data.job;
        const q1 = await dispatch(getResults(job));
        const q2 = await dispatch(getJobStatesWithFiles(job));
        const enhancedJob = {
          ...job,
          tests: sortByName<ITest>(q1.data.results),
          jobstates: q2.data.jobstates,
        };
        setJob(enhancedJob);
        return response;
      })
      .catch(console.log)
      .then(() => setIsFetching(false));
  }, [endpoint, dispatch, id]);
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
                  if (job && tabIndex !== undefined) {
                    const newTabIndex = parseInt(tabIndex as string, 10);
                    setActiveTabKey(newTabIndex);
                    history.push(
                      `/jobs/${job.id}/${endpoints[newTabIndex].value}`
                    );
                  }
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
      {activeTabKey === 0 && job && (
        <Stack>
          <StackItem>
            <JobSummary job={job} />
          </StackItem>
          <JobStatesList job={job} />
          <StackItem></StackItem>
        </Stack>
      )}
      {activeTabKey === 1 && job && job.tests && (
        <Stack>
          <StackItem>
            <JobSummary job={job} />
          </StackItem>
          <TestsList tests={job.tests} />
          <StackItem></StackItem>
        </Stack>
      )}
      {activeTabKey === 2 && job && job.files && (
        <Stack>
          <StackItem>
            <JobSummary job={job} />
          </StackItem>
          <FilesList files={job.files} />
          <StackItem></StackItem>
        </Stack>
      )}
      {activeTabKey === 3 && job && (
        <Stack>
          <StackItem>
            <JobSettingsPage job={job} />
          </StackItem>
        </Stack>
      )}
    </Page>
  );
}
