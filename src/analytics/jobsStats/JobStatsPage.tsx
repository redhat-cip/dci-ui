import {
  Card,
  CardBody,
  Content,
  Form,
  FormGroup,
  Gallery,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { useMemo, useState } from "react";
import { useGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";

import { skipToken } from "@reduxjs/toolkit/query";
import Select from "ui/form/Select";
import {
  getJobStats,
  IGroupByKey,
  groupByKeys,
  groupByKeysWithLabel,
} from "./jobStats";
import JobStatChart from "./JobStatChart";
import useLocalStorage from "hooks/useLocalStorage";

function JobStatsGraphs({
  data,
  ...props
}: {
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse;
  [key: string]: any;
}) {
  const [groupByKey, setGroupByKey] = useLocalStorage<IGroupByKey>(
    "jobStatsGroupByKey",
    "topic",
  );
  const jobStats = useMemo(
    () => getJobStats(data, groupByKey),
    [data, groupByKey],
  );

  return (
    <Card className="pf-v6-u-mt-md" {...props}>
      <CardBody>
        <Gallery hasGutter className="pf-v6-u-mt-md">
          <Form>
            <FormGroup label="Group by">
              <Select
                onSelect={(selection) => {
                  if (selection) {
                    setGroupByKey(selection.value);
                  }
                }}
                item={{
                  value: groupByKey,
                  label: groupByKeysWithLabel[groupByKey],
                }}
                items={groupByKeys.map((key) => ({
                  value: key,
                  label: groupByKeysWithLabel[key],
                }))}
              />
            </FormGroup>
          </Form>
        </Gallery>
        <Gallery hasGutter className="pf-v6-u-mt-md">
          {Object.entries(jobStats).map(([name, stat], index) => (
            // <GalleryItem key={index}>
            <Card key={index}>
              <CardBody>
                <JobStatChart name={name} stat={stat} />
              </CardBody>
            </Card>
            // </GalleryItem>
          ))}
        </Gallery>
      </CardBody>
    </Card>
  );
}

function JobStats({
  isLoading,
  data,
  after,
  before,
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  before: string;
  after: string;
  [key: string]: any;
}) {
  if (isLoading) {
    return (
      <Card {...props}>
        <CardBody>
          <Skeleton
            screenreaderText="Loading analytics jobs"
            style={{ height: 80 }}
          />
        </CardBody>
      </Card>
    );
  }

  if (!data || !data.hits) {
    return null;
  }

  return <JobStatsGraphs data={data} />;
}

export default function JobStatsPage() {
  const [params, setParams] = useState<{
    query: string;
    after: string;
    before: string;
  }>({
    query: "",
    after: "",
    before: "",
  });
  const { query, after, before } = params;
  const shouldSearch = query !== "" && after !== "" && before !== "";
  const { data, isLoading, isFetching } = useGetAnalyticJobsQuery(
    shouldSearch ? params : skipToken,
  );
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Job Stats" },
        ]}
      />
      <Content component="h1">Job Stats</Content>
      <Content component="p">Build a statistical view of your jobs!</Content>
      <AnalyticsToolbar
        onLoad={setParams}
        onSearch={setParams}
        isLoading={isFetching}
        data={data}
      />
      <JobStats
        isLoading={isLoading}
        data={data}
        after={after}
        before={before}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
