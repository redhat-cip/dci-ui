import { Breadcrumb, CopyIconButton } from "ui";
import { useLocation, useNavigate } from "react-router";
import {
  PageSection,
  Tab,
  Tabs,
  Content,
  TabTitleText,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";

const endpoints = [
  { title: "Logs", value: "jobStates" },
  { title: "Tests", value: "tests" },
  { title: "Files", value: "files" },
  { title: "Settings", value: "settings" },
];

export default function JobDetailsEnvelope({
  job_id,
  children = "",
}: {
  job_id: string;
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  useEffect(() => {
    const endpointIndex = endpoints.findIndex((e) =>
      location.pathname.includes(`${job_id}/${e.value}`),
    );
    if (endpointIndex !== -1) {
      setActiveTabKey(endpointIndex);
    }
  }, [location, job_id]);

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/jobs", title: "Jobs" },
          {
            to: `/jobs/${job_id}`,
            title: (
              <span>
                {job_id}
                <CopyIconButton
                  text={job_id}
                  textOnSuccess="copied"
                  className="pf-v6-u-ml-xs pointer"
                />
              </span>
            ),
          },
        ]}
      />
      <Content component="h1">Job details</Content>
      <Tabs
        activeKey={activeTabKey}
        onSelect={(event, tabIndex) => {
          if (tabIndex !== undefined) {
            const newTabIndex = parseInt(tabIndex as string, 10);
            setActiveTabKey(newTabIndex);
            navigate(`/jobs/${job_id}/${endpoints[newTabIndex].value}`);
          }
        }}
        className="pf-v6-u-mb-md"
      >
        {endpoints.map((endpoint, i) => (
          <Tab
            key={endpoint.value}
            eventKey={i}
            title={<TabTitleText>{endpoint.title}</TabTitleText>}
          ></Tab>
        ))}
      </Tabs>
      {children}
    </PageSection>
  );
}
