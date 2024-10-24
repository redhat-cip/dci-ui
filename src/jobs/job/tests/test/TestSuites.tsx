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
  TextVariants,
} from "@patternfly/react-core";
import { ITestCaseActionType, ITestSuite } from "types";
import { Table, Thead, Tr, Th } from "@patternfly/react-table";
import TestCase from "./TestCase";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

interface TestsCasesProps {
  testsuites: ITestSuite[];
}

const testscaseActions: ITestCaseActionType[] = [
  "error",
  "failure",
  "skipped",
  "success",
];

export default function TestSuites({ testsuites }: TestsCasesProps) {
  const [searchParams] = useSearchParams();
  const testCaseParamName = "testcase";
  const testcaseToExpand = searchParams.get(testCaseParamName);
  const [search, setSearch] = useState("");
  return (
    <div>
      <div className="pf-v5-u-mb-md text-right" style={{ maxWidth: 300 }}>
        <SearchInput
          placeholder="Find test by name"
          value={search}
          onChange={(_event, value) => setSearch(value)}
          onClear={() => setSearch("")}
        />
      </div>
      {testsuites.map((testsuite, i) => (
        <div key={i}>
          <Text component={TextVariants.h2}>
            {testsuite.name || `test suite ${i + 1}`}
          </Text>
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
                    <Th screenReaderText="Row expansion" />
                    <Th screenReaderText="Testcase action" />
                    <Th screenReaderText="Testcase success or regression"></Th>
                    <Th>Name</Th>
                    <Th style={{ minWidth: 100 }} className="text-center">
                      Duration
                    </Th>
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
