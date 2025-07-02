import {
  Banner,
  Flex,
  FlexItem,
  SearchInput,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import type {
  IGetJunitTestSuites,
  ITestCase,
  ITestCaseActionType,
} from "types";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import TestCase, { TestCaseState } from "./TestCase";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import {
  t_global_color_nonstatus_green_default,
  t_global_color_nonstatus_orange_default,
  t_global_color_nonstatus_red_default,
  t_global_color_nonstatus_blue_default,
  t_global_text_color_nonstatus_on_blue_default,
  t_global_border_color_nonstatus_blue_default,
  t_global_text_color_nonstatus_on_green_default,
  t_global_text_color_nonstatus_on_orange_default,
  t_global_text_color_nonstatus_on_red_default,
  t_global_border_color_nonstatus_green_default,
  t_global_border_color_nonstatus_red_default,
  t_global_border_color_nonstatus_orange_default,
} from "@patternfly/react-tokens";

interface TestsCasesProps {
  junit: IGetJunitTestSuites;
}

const testscaseActions: { [key in ITestCaseActionType]: number } = {
  error: 0,
  failure: 1,
  skipped: 2,
  success: 3,
};

type Color = "blue" | "green" | "orange" | "red";

function SummaryItem({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: Color;
}) {
  const colors = {
    blue: {
      backgroundColor: t_global_color_nonstatus_blue_default.var,
      borderColor: t_global_border_color_nonstatus_blue_default.var,
      color: t_global_text_color_nonstatus_on_blue_default.var,
    },
    green: {
      backgroundColor: t_global_color_nonstatus_green_default.var,
      borderColor: t_global_border_color_nonstatus_green_default.var,
      color: t_global_text_color_nonstatus_on_green_default.var,
    },
    red: {
      backgroundColor: t_global_color_nonstatus_red_default.var,
      borderColor: t_global_border_color_nonstatus_red_default.var,
      color: t_global_text_color_nonstatus_on_red_default.var,
    },
    orange: {
      backgroundColor: t_global_color_nonstatus_orange_default.var,
      borderColor: t_global_border_color_nonstatus_orange_default.var,
      color: t_global_text_color_nonstatus_on_orange_default.var,
    },
  };
  return (
    <div
      className="text-center pf-v6-u-p-md"
      style={{
        ...colors[color],
        borderWidth: 1,
        borderStyle: "solid",
        width: 100,
      }}
    >
      <div>
        <span>{title}</span>
      </div>
      <div>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</span>
      </div>
    </div>
  );
}

function TestCases({
  testcases,
  search,
}: {
  testcases: ITestCase[];
  search: string;
}) {
  const [searchParams] = useSearchParams();
  const testCaseParamName = "testcase";
  const testcaseToExpand = searchParams.get(testCaseParamName);
  if (testcases.length === 0) {
    return (
      <Banner
        screenReaderText="No test case banner"
        color="blue"
        className="pf-v6-u-mt-sm"
      >
        <Flex spaceItems={{ default: "spaceItemsSm" }}>
          <FlexItem>
            <InfoCircleIcon />
          </FlexItem>
          <FlexItem>There is no test case in this test suite</FlexItem>
        </Flex>
      </Banner>
    );
  }
  return (
    <Table aria-label="Testsuite table">
      <Thead>
        <Tr>
          <Th modifier="fitContent"></Th>
          <Th>Name</Th>
          <Th
            textCenter
            modifier="fitContent"
            info={{
              popover: (
                <div>
                  <Content component={ContentVariants.p}>
                    The result of a test case is compared with its previous
                    result in the previous test. A test case can have 5 states.
                  </Content>
                  <Content component={ContentVariants.p}>
                    If state is empty, the test has the same state as before
                  </Content>
                  <TestCaseState state="REMOVED" className="pf-v6-u-mb-xs" />
                  <Content component={ContentVariants.p}>
                    The test was present in the previous job and it was deleted
                    in this job.
                  </Content>
                  <TestCaseState state="ADDED" className="pf-v6-u-mb-xs" />
                  <Content component={ContentVariants.p}>
                    The test is not present in the previous job.
                  </Content>
                  <TestCaseState state="RECOVERED" className="pf-v6-u-mb-xs" />
                  <Content component={ContentVariants.p}>
                    The test is successful now, congratulation
                  </Content>
                  <TestCaseState state="REGRESSED" className="pf-v6-u-mb-xs" />
                  <Content component={ContentVariants.p}>
                    The test is no longer successful
                  </Content>
                </div>
              ),
            }}
          >
            State
          </Th>
          <Th textCenter modifier="fitContent">
            Action
          </Th>
          <Th textCenter modifier="fitContent">
            Duration
          </Th>
          <Th modifier="fitContent">Class name</Th>
          <Th>Type</Th>
        </Tr>
      </Thead>
      {testcases
        .sort(
          (tc1, tc2) =>
            testscaseActions[tc1.action] - testscaseActions[tc2.action],
        )
        .filter((tc) => tc.name.toLowerCase().includes(search.toLowerCase()))
        .map((testcase, i) => (
          <TestCase
            key={i}
            index={i}
            testcase={testcase}
            isExpanded={testcaseToExpand === testcase.name}
            expand={(isExpanded) => {
              if (isExpanded) {
                searchParams.set(testCaseParamName, testcase.name);
              }
              window.history.replaceState(
                {},
                "",
                `?${searchParams.toString()}`,
              );
            }}
          />
        ))}
    </Table>
  );
}

export default function TestSuites({ junit }: TestsCasesProps) {
  const [search, setSearch] = useState("");
  return (
    <div>
      <Flex className="pf-v6-u-mb-md">
        <FlexItem>
          <SearchInput
            placeholder="Filter by test case"
            value={search}
            onChange={(_event, value) => setSearch(value)}
            onClear={() => setSearch("")}
          />
        </FlexItem>
      </Flex>
      {junit.testsuites.map((testsuite, i) => (
        <div key={i} className="pf-v6-u-mb-xl">
          <div>
            <Content component={ContentVariants.h3}>{testsuite.name}</Content>
            {junit.previous_job !== null && (
              <Content component={ContentVariants.p}>
                This job (
                <Link to={`/jobs/${junit.job.id}/jobStates`}>
                  {junit.job.name}
                </Link>
                ) was compared with the previous job (
                <Link to={`/jobs/${junit.previous_job.id}/jobStates`}>
                  {junit.previous_job.name}
                </Link>
                ).
              </Content>
            )}
          </div>
          <Flex
            columnGap={{ default: "columnGap2xl" }}
            className="pf-v6-u-my-md"
          >
            <FlexItem>
              <SummaryItem
                title={testsuite.tests > 1 ? "Tests" : "Test"}
                value={testsuite.tests}
                color="blue"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Passed"
                value={testsuite.success}
                color="green"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Failed"
                value={testsuite.failures}
                color="red"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem title="Error" value={testsuite.errors} color="red" />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Skipped"
                value={testsuite.skipped}
                color="orange"
              />
            </FlexItem>
          </Flex>
          {testsuite.properties.length > 0 && (
            <>
              <Content className="pf-v6-u-my-md" component={ContentVariants.h4}>
                Properties
              </Content>
              <Table aria-label="Properties table">
                <Tbody>
                  {testsuite.properties.map((property, i) => (
                    <Tr key={i}>
                      <Td>{property.name}</Td>
                      <Td>{property.value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Content className="pf-v6-u-my-md" component={ContentVariants.h4}>
                Test cases
              </Content>
            </>
          )}
          <TestCases testcases={[...testsuite.testcases]} search={search} />
        </div>
      ))}
    </div>
  );
}
