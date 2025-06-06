import {
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  PageSection,
  Skeleton,
  TextInput,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { createRef, useMemo, useState } from "react";
import { useGetAnalyticsTestsJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import { IAnalyticsTestsJob, IGenericAnalyticsData } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import { getTestingTrend, TestcaseEntry } from "./testingTrend";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import {
  chart_color_black_200,
  chart_color_green_300,
  chart_color_orange_300,
  chart_color_red_orange_300,
} from "@patternfly/react-tokens";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";

const statusColorMap: Record<string, string> = {
  success: chart_color_green_300.var,
  failure: chart_color_red_orange_300.var,
  skipped: chart_color_orange_300.var,
  error: chart_color_red_orange_300.var,
  absent: chart_color_black_200.var,
};

function JobsFlaskyGraph({ jobs }: { jobs: TestcaseEntry["jobs"] }) {
  return (
    <div className="flex gap-1" style={{ gap: "1px", width: "350px" }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          title={`Job: ${job.id}\nStatus: ${job.status}`}
          style={{
            width: "8px",
            height: "20px",
            backgroundColor:
              statusColorMap[job.status] || statusColorMap.absent,
          }}
        />
      ))}
    </div>
  );
}

function TestingTrendGraph({
  data,
  ...props
}: {
  data: IAnalyticsTestsJob[];
  [key: string]: any;
}) {
  const graphRef = createRef<HTMLDivElement>();
  const [testcaseFilter, setTestcaseFilter] = useState("");

  const trend = useMemo(() => {
    return getTestingTrend(data);
  }, [data]);

  return (
    <div {...props}>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form>
            <Flex
              columnGap={{ default: "columnGap2xl" }}
              direction={{ default: "column", lg: "row" }}
              justifyContent={{ default: "justifyContentSpaceBetween" }}
            >
              <Flex
                flex={{ default: "flex_1" }}
                columnGap={{ default: "columnGapXl" }}
              >
                <FormGroup label="Filter testcases">
                  <TextInput
                    id="testing-trend-group-filter"
                    type="text"
                    value={testcaseFilter}
                    onChange={(_event, value) => setTestcaseFilter(value)}
                    placeholder="Filter testcases by name"
                  />
                </FormGroup>
              </Flex>
              <Flex alignSelf={{ default: "alignSelfFlexEnd" }}>
                <FlexItem>
                  <ScreeshotNodeButton
                    node={graphRef}
                    filename="testing-trend.png"
                  />
                </FlexItem>
              </Flex>
            </Flex>
          </Form>
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md" ref={graphRef}>
        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Jobs</Th>
                <Th>Testcase</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trend
                .filter((tc) =>
                  tc.name.toLowerCase().includes(testcaseFilter.toLowerCase()),
                )
                .map((testcase) => (
                  <Tr key={`${testcase.name}`}>
                    <Td>
                      <JobsFlaskyGraph jobs={testcase.jobs} />
                    </Td>
                    <Td style={{ verticalAlign: "middle" }}>{testcase.name}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

function TestingTrend({
  isLoading,
  data,
  after,
  before,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsTestsJob> | undefined;
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

  if (data === undefined) {
    return null;
  }

  return <TestingTrendGraph data={data.jobs} />;
}

export default function TestingTrendPage() {
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
  const { data, isLoading, isFetching } = useGetAnalyticsTestsJobsQuery(
    shouldSearch ? params : skipToken,
  );
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Testing trend" },
        ]}
      />
      <Content component="h1">Testing trend</Content>
      <Content component="p">See testing trend and detect flaky tests.</Content>
      <AnalyticsToolbar
        onLoad={setParams}
        onSearch={setParams}
        isLoading={isFetching}
        data={data}
      />
      <TestingTrend
        isLoading={isLoading}
        data={data}
        after={after}
        before={before}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
