import { Page } from "layout";
import { Breadcrumb } from "ui";
import { useJob } from "./jobContext";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  Text,
  TabTitleText,
  TextContent,
} from "@patternfly/react-core";
import JobSummary from "jobs/JobSummary";
import { useEffect, useState } from "react";

export default function JobPageWithMenu() {
  const { job } = useJob();
  const navigate = useNavigate();
  const location = useLocation();
  const endpoints = [
    { title: "Logs", value: "jobStates" },
    { title: "Tests", value: "tests" },
    { title: "Files", value: "files" },
    { title: "Settings", value: "settings" },
  ];
  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  useEffect(() => {
    const endpointIndex = endpoints.findIndex((e) =>
      location.pathname.endsWith(e.value)
    );
    setActiveTabKey(endpointIndex === -1 ? 0 : endpointIndex);
  }, [location]);

  return (
    <Page
      title="Job Details"
      description=""
      HeaderSection={
        <PageSection
          variant={PageSectionVariants.light}
          style={{ paddingBottom: 0 }}
        >
          <TextContent className="mb-md">
            <Text component="h1">Job details</Text>
          </TextContent>
          <Tabs
            activeKey={activeTabKey}
            onSelect={(event, tabIndex) => {
              if (tabIndex !== undefined) {
                const newTabIndex = parseInt(tabIndex as string, 10);
                setActiveTabKey(newTabIndex);
                navigate(`/jobs/${job.id}/${endpoints[newTabIndex].value}`);
              }
            }}
          >
            {endpoints.map((endpoint, i) => (
              <Tab
                key={endpoint.value}
                eventKey={i}
                title={<TabTitleText>{endpoint.title}</TabTitleText>}
              ></Tab>
            ))}
          </Tabs>
        </PageSection>
      }
      breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/jobs", title: "Jobs" },
            { to: `/jobs/${job.id}`, title: job.id },
          ]}
        />
      }
    >
      <JobSummary job={job} />
      <Outlet />
    </Page>
  );
}
