import {
  Card,
  CardBody,
  Content,
  Form,
  FormGroup,
  Label,
  PageSection,
  Pagination,
  Skeleton,
  TextInput,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { createRef, useMemo, useState } from "react";
import { useLazyGetAnalyticsTestsJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import type {
  AnalyticsToolbarSearch,
  IAnalyticsTestsJob,
  IGenericAnalyticsData,
} from "types";
import {
  analyseTests,
  type TestcaseEntry,
  type TestCaseResult,
} from "./testsAnalysis";
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
import { Document } from "flexsearch";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
import { useDebounce } from "use-debounce";
import { offsetAndLimitToPage, pageAndLimitToOffset } from "services/filters";
import { sortByOldestFirst } from "services/sort";

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
      {sortByOldestFirst(jobs).map((job) => {
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

type SearchItem = { id: string; search: string };

function TestingTrendGraphWithIndex({
  searchIndex,
  tests,
}: {
  searchIndex: Document<SearchItem>;
  tests: TestcaseEntry[];
}) {
  const [pagination, setPagination] = useState<{
    offset: number;
    limit: number;
  }>({
    offset: 0,
    limit: 100,
  });

  const testsByIds = tests.reduce(
    (acc, test) => {
      acc[test.id] = test;
      return acc;
    },
    {} as { [id: string]: TestcaseEntry },
  );
  const graphRef = createRef<HTMLDivElement>();
  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebounce(filter, 1000);

  const filteredTests = useMemo(() => {
    if (!debouncedFilter)
      return tests.slice(
        pagination.offset,
        pagination.offset + pagination.limit,
      );
    const rawResults = searchIndex.search(debouncedFilter, {
      pluck: "search",
      limit: pagination.limit,
    });
    return rawResults.map((id) => testsByIds[id]);
  }, [tests, debouncedFilter, searchIndex, testsByIds, pagination]);

  return (
    <div>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between">
              <div>
                <FormGroup label="Filter testcases">
                  <TextInput
                    id="testing-trend-group-filter"
                    type="text"
                    value={filter}
                    onChange={(event, value) => {
                      event.preventDefault();
                      return setFilter(value);
                    }}
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
      <div ref={graphRef} className="pf-v6-u-pb-md">
        <Card className="pf-v6-u-mt-md">
          <CardBody style={{ overflowX: "auto" }}>
            <Pagination
              perPage={pagination.limit}
              page={offsetAndLimitToPage(pagination.offset, pagination.limit)}
              itemCount={tests.length}
              onSetPage={(_, newPage) => {
                setPagination({
                  ...pagination,
                  offset: pageAndLimitToOffset(newPage, pagination.limit),
                });
              }}
              onPerPageSelect={(_, newPerPage) => {
                setPagination({ ...pagination, limit: newPerPage });
              }}
              isDisabled={debouncedFilter !== ""}
            />
            <Table>
              <Thead>
                <Tr>
                  <Th width={20}>Jobs status</Th>
                  <Th width={10}>Test suite</Th>
                  <Th width={10}>File name</Th>
                  <Th width={10}>Class name</Th>
                  <Th width={50}>Test case</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Legend />
                  </Td>
                  <Td colSpan={3}>
                    {debouncedFilter !== "" &&
                      filteredTests.length === pagination.limit && (
                        <Label
                          isCompact
                          icon={<ExclamationTriangleIcon />}
                          color="orange"
                          className="pf-v6-u-ml-xs"
                        >
                          {`For performance reasons, the search only return the ${pagination.limit} first matching elements. Be more specific in your search.`}
                        </Label>
                      )}
                  </Td>
                </Tr>
                {filteredTests.map((testcase) => (
                  <Tr key={`${testcase.id}`}>
                    <Td>
                      <JobsFlaskyGraph
                        testcase={testcase.name}
                        jobs={testcase.jobs}
                      />
                    </Td>
                    <Td>{testcase.testsuiteName}</Td>
                    <Td>{testcase.filename}</Td>
                    <Td>{testcase.classname}</Td>
                    <Td>{testcase.name}</Td>
                  </Tr>
                ))}
                {debouncedFilter !== "" &&
                  filteredTests.length === 0 &&
                  tests.length > 0 && (
                    <Tr>
                      <Td colSpan={4}>
                        <Label
                          isCompact
                          icon={<ExclamationTriangleIcon />}
                          color="blue"
                        >
                          There is no testcase matching your search. For
                          performance reasons, the search only works on an exact
                          word. Case insentivite.
                        </Label>
                      </Td>
                    </Tr>
                  )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
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
  const tests = analyseTests(data);
  const searchIndex = useMemo(() => {
    const idx = new Document<SearchItem>({
      document: {
        id: "id",
        index: ["id", "search"],
      },
    });
    tests.forEach((test) => {
      idx.add({
        id: test.id,
        search: `${test.testsuiteName} ${test.filename} ${test.classname} ${test.name}`,
      });
    });
    return idx;
  }, [tests]);

  return (
    <div {...props}>
      <TestingTrendGraphWithIndex tests={tests} searchIndex={searchIndex} />
    </div>
  );
}

function TestingTrend({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsTestsJob> | undefined;
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
  const [getAnalyticsTestsJobsQuery, { data, isLoading, isFetching }] =
    useLazyGetAnalyticsTestsJobsQuery();
  const getTests = (values: AnalyticsToolbarSearch) => {
    if (values.query) {
      getAnalyticsTestsJobsQuery(values);
    }
  };
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
        onLoad={getTests}
        onSearch={getTests}
        isLoading={isFetching}
        data={data}
        initialSearches={{
          limit: 10,
        }}
      />
      <TestingTrend
        isLoading={isLoading}
        data={data}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
