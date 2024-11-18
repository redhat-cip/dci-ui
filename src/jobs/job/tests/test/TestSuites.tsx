import {
  Banner,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  SearchInput,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { IGetJunitTestSuites, ITestCaseActionType } from "types";
import { Table, Thead, Tr, Th } from "@patternfly/react-table";
import TestCase, { TestCaseState } from "./TestCase";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  c_label_m_red_BackgroundColor,
  c_label_m_red__content_before_BorderColor,
  c_label_m_red__content_Color,
  c_label_m_blue_BackgroundColor,
  c_label_m_blue__content_before_BorderColor,
  c_label_m_blue__content_Color,
  c_label_m_green_BackgroundColor,
  c_label_m_green__content_before_BorderColor,
  c_label_m_green__content_Color,
  c_label_m_orange_BackgroundColor,
  c_label_m_orange__content_before_BorderColor,
  c_label_m_orange__content_Color,
} from "@patternfly/react-tokens";

interface TestsCasesProps {
  junit: IGetJunitTestSuites;
}

const testscaseActions: ITestCaseActionType[] = [
  "error",
  "failure",
  "skipped",
  "success",
];

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
      backgroundColor: c_label_m_blue_BackgroundColor.value,
      borderColor: c_label_m_blue__content_before_BorderColor.value,
      color: c_label_m_blue__content_Color.value,
    },
    green: {
      backgroundColor: c_label_m_green_BackgroundColor.value,
      borderColor: c_label_m_green__content_before_BorderColor.value,
      color: c_label_m_green__content_Color.value,
    },
    red: {
      backgroundColor: c_label_m_red_BackgroundColor.value,
      borderColor: c_label_m_red__content_before_BorderColor.value,
      color: c_label_m_red__content_Color.value,
    },
    orange: {
      backgroundColor: c_label_m_orange_BackgroundColor.value,
      borderColor: c_label_m_orange__content_before_BorderColor.value,
      color: c_label_m_orange__content_Color.value,
    },
  };
  return (
    <div
      className="text-center pf-v5-u-p-md"
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

export default function TestSuites({ junit }: TestsCasesProps) {
  const [searchParams] = useSearchParams();
  const testCaseParamName = "testcase";
  const testcaseToExpand = searchParams.get(testCaseParamName);
  const [search, setSearch] = useState("");
  return (
    <div>
      {junit.testsuites.map((testsuite, i) => (
        <div key={i}>
          <TextContent>
            <Text component={TextVariants.h3}>Summary</Text>
            {junit.previous_job !== null && (
              <Text component={TextVariants.p}>
                This{" "}
                <Link to={`/jobs/${junit.job.id}/jobStates`}>
                  job ({junit.job.name})
                </Link>{" "}
                was compared with the{" "}
                <Link to={`/jobs/${junit.previous_job.id}/jobStates`}>
                  previous job ({junit.previous_job.name})
                </Link>
                .
              </Text>
            )}
          </TextContent>
          <Flex
            columnGap={{ default: "columnGap2xl" }}
            className="pf-v5-u-my-md"
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
          <TextContent className="pf-v5-u-my-md">
            <Text component={TextVariants.h3}>
              {testsuite.name || `test suite ${i + 1}`}
            </Text>
          </TextContent>
          <Flex>
            <FlexItem>
              <SearchInput
                placeholder="Find test by name"
                value={search}
                onChange={(_event, value) => setSearch(value)}
                onClear={() => setSearch("")}
              />
            </FlexItem>
          </Flex>
          <div>
            {testsuite.properties.length > 0 && (
              <DescriptionList isHorizontal isFluid>
                {testsuite.properties.map((property, i) => (
                  <DescriptionListGroup key={i}>
                    <DescriptionListTerm>{property.name}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {property.value}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            )}
            {testsuite.testcases.length === 0 ? (
              <Banner
                screenReaderText="No test case banner"
                variant="blue"
                className="pf-v5-u-mt-sm"
              >
                <Flex spaceItems={{ default: "spaceItemsSm" }}>
                  <FlexItem>
                    <InfoCircleIcon />
                  </FlexItem>
                  <FlexItem>There is no test case in this test suite</FlexItem>
                </Flex>
              </Banner>
            ) : (
              <Table role="grid" aria-label="Testsuite table" variant="compact">
                <Thead>
                  <Tr role="row">
                    <Th modifier="fitContent"></Th>
                    <Th>Name</Th>
                    <Th
                      textCenter
                      modifier="fitContent"
                      info={{
                        popover: (
                          <TextContent>
                            <Text component={TextVariants.p}>
                              The result of a test case is compared with its
                              previous result in the previous test. A test case
                              can have 5 states.
                            </Text>
                            <Text component={TextVariants.p}>
                              If state is empty, the test has the same state as
                              before
                            </Text>
                            <TestCaseState
                              state="REMOVED"
                              className="pf-v5-u-mb-xs"
                            />
                            <Text component={TextVariants.p}>
                              The test was present in the previous job and it
                              was deleted in this job.
                            </Text>
                            <TestCaseState
                              state="ADDED"
                              className="pf-v5-u-mb-xs"
                            />
                            <Text component={TextVariants.p}>
                              The test is not present in the previous job.
                            </Text>
                            <TestCaseState
                              state="RECOVERED"
                              className="pf-v5-u-mb-xs"
                            />
                            <Text component={TextVariants.p}>
                              The test is successful now, congratulation
                            </Text>
                            <TestCaseState
                              state="REGRESSED"
                              className="pf-v5-u-mb-xs"
                            />
                            <Text component={TextVariants.p}>
                              The test is no longer successful
                            </Text>
                          </TextContent>
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
                {testsuite.testcases
                  .sort(
                    (tc1, tc2) =>
                      testscaseActions.indexOf(tc1.action) -
                      testscaseActions.indexOf(tc2.action),
                  )
                  .filter((tc) =>
                    tc.name.toLowerCase().includes(search.toLowerCase()),
                  )
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
