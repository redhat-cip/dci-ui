import {
  Card,
  CardBody,
  Content,
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
import { analyseTests, TestcaseEntry, TestCaseResult } from "./testsAnalysis";
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

const statusColorMap: Record<TestCaseResult, string> = {
  success: chart_color_green_300.var,
  skipped: chart_color_orange_200.var,
  failure: chart_color_red_orange_300.var,
  error: chart_color_red_orange_400.var,
  absent: chart_color_black_200.var,
};

function JobsFlaskyGraph({
  testcase,
  jobs,
}: {
  testcase: string;
  jobs: TestcaseEntry["jobs"];
}) {
  return (
    <div className="flex" style={{ gap: "1px" }}>
      {jobs.map((job) => {
        const title = `Job: ${job.id}\nStatus: ${job.status}\nCreated at: ${job.created_at}`;
        return job.status === "absent" ? (
          <div
            key={job.id}
            title={title}
            style={{
              flex: 1,
              height: "20px",
              backgroundColor: statusColorMap.absent,
            }}
          />
        ) : (
          <Link
            key={job.id}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            to={`/jobs/${job.id}/tests/${job.fileId}?testcase=${testcase}`}
            style={{
              flex: 1,
              height: "20px",
              backgroundColor:
                statusColorMap[job.status] || statusColorMap.absent,
            }}
          />
        );
      })}
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
            backgroundColor: statusColorMap[colorKey as TestCaseResult],
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
  const [filter, setFilter] = useState("");
  const tests = analyseTests(data);

  const filteredTests = useMemo(
    () =>
      tests.filter((tc) => {
        const testcaseFilterLowerCase = filter.toLowerCase();
        return (
          tc.filename.toLowerCase().includes(testcaseFilterLowerCase) ||
          tc.classname.toLowerCase().includes(testcaseFilterLowerCase) ||
          tc.name.toLowerCase().includes(testcaseFilterLowerCase)
        );
      }),
    [tests, filter],
  );

  return (
    <div {...props}>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form>
            <div className="flex items-center justify-between">
              <div>
                <FormGroup label="Filter testcases">
                  <TextInput
                    id="testing-trend-group-filter"
                    type="text"
                    value={filter}
                    onChange={(_event, value) => setFilter(value)}
                    placeholder="Filter by file name, class name or testcase"
                    style={{ minWidth: "300px" }}
                  />
                </FormGroup>
              </div>
              <div>
                <ScreeshotNodeButton
                  node={graphRef}
                  filename="test-analysis.png"
                />
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md" ref={graphRef}>
        <CardBody>
          <Table>
            <Thead>
              <Tr style={{ marginTop: "-10em" }}>
                <Th width={20}>Jobs status</Th>
                <Th>File name</Th>
                <Th>Class name</Th>
                <Th>
                  Test case (
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
                <Td colSpan={3}></Td>
              </Tr>
              {filteredTests.map((testcase) => (
                <Tr key={`${testcase.key}`}>
                  <Td>
                    <JobsFlaskyGraph
                      testcase={testcase.name}
                      jobs={testcase.jobs}
                    />
                  </Td>
                  <Td>{testcase.filename}</Td>
                  <Td>{testcase.classname}</Td>
                  <Td>{testcase.name}</Td>
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
