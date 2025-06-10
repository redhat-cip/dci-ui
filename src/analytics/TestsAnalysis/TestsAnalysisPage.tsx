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
import { analyseTests, TestcaseEntry } from "./testsAnalysis";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import {
  chart_color_black_200,
  chart_color_green_300,
  chart_color_orange_200,
  chart_color_red_orange_300,
  chart_color_red_orange_400,
} from "@patternfly/react-tokens";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import { Link } from "react-router";

const statusColorMap: Record<string, string> = {
  success: chart_color_green_300.var,
  skipped: chart_color_orange_200.var,
  failure: chart_color_red_orange_300.var,
  error: chart_color_red_orange_400.var,
  absent: chart_color_black_200.var,
};

function JobsFlaskyGraph({ jobs }: { jobs: TestcaseEntry["jobs"] }) {
  return (
    <div className="flex" style={{ gap: "1px" }}>
      {jobs.map((job) => (
        <Link
          key={job.id}
          target="_blank"
          rel="noopener noreferrer"
          title={`Job: ${job.id}\nStatus: ${job.status}`}
          to={`/jobs/${job.id}/jobStates`}
          style={{
            flex: 1,
            height: "20px",
            backgroundColor:
              statusColorMap[job.status] || statusColorMap.absent,
          }}
        />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex" style={{ gap: "1px" }}>
      {Object.keys(statusColorMap).map((colorKey) => (
        <div
          key={colorKey}
          style={{
            padding: "0 .2em",
            flex: 1,
            fontSize: "12px",
            backgroundColor: statusColorMap[colorKey],
            textAlign: "center",
          }}
        >
          {colorKey}
        </div>
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

  const tests = useMemo(() => {
    return analyseTests(data);
  }, [data]);

  const filteredTests = tests.filter((tc) =>
    tc.name.toLowerCase().includes(testcaseFilter.toLowerCase()),
  );

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
              <Tr style={{ marginTop: "-10em" }}>
                <Th width={20}>Status</Th>
                <Th width={80}>
                  Classname::Name (
                  {filteredTests.length === tests.length
                    ? `${tests.length} tests`
                    : `${filteredTests.length} / ${tests.length} tests`}
                  )
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Legend />
                </Td>
                <Td>Classname and testcase name separated by ::</Td>
              </Tr>
              {filteredTests.map((testcase) => (
                <Tr key={`${testcase.name}`}>
                  <Td>
                    <JobsFlaskyGraph jobs={testcase.jobs} />
                  </Td>
                  <Td style={{ verticalAlign: "middle" }}>{testcase.name}</Td>
                </Tr>
              ))}
              {filteredTests.length === 0 && tests.length > 0 && (
                <Tr>
                  <Td colSpan={2}>There is no testcase matching your search</Td>
                </Tr>
              )}
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

export default function TestsAnalysisPage() {
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
          { title: "Tests Analysis" },
        ]}
      />
      <Content component="h1">Tests Analysis</Content>
      <Content component="p">Analyze your tests and detect flaky ones.</Content>
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
