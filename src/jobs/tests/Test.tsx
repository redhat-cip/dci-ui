import { Button, Label } from "@patternfly/react-core";
import React, { useCallback, useState } from "react";
import { IFile, ITest, ITestsCase } from "types";
import { isEmpty } from "lodash";
import { humanizeDuration } from "services/date";
import { global_Color_light_200 } from "@patternfly/react-tokens";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import TestsCases from "./TestsCases";
import { getTestsCases } from "./testsActions";

interface TestProps {
  test: ITest;
}

const TestDiv = styled.div`
  border-top: 1px solid ${global_Color_light_200.value};
  &:first-child {
    border-top: none;
  }
`;

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0.5em;
`;

const TestsDetails = styled.div`
  padding: 1em 0.5em;
`;

export default function Test({ test }: TestProps) {
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(false);
  const [seeDetails, setSeeDetails] = useState(false);
  const [testscases, setTestscases] = useState<ITestsCase[]>([]);

  const loadTestCases = useCallback(() => {
    setSeeDetails(true);
    if (isEmpty(testscases)) {
      setIsLoadingTestsCases(true);
      const file = { id: test.file_id } as IFile;
      getTestsCases(file)
        .then((r) => {
          setTestscases(r.data.testscases);
        })
        .finally(() => {
          setIsLoadingTestsCases(false);
        });
    }
  }, [test.file_id, testscases]);

  return (
    <TestDiv>
      <TestHeader>
        <div>
          <span className="mr-lg">
            {test.name || "Test"} ({humanizeDuration(test.time)})
          </span>
          <Label color="blue" className="mr-xs">
            {test.total} tests
          </Label>
          {test.successfixes ? (
            <Label icon={<CheckCircleIcon />} color="green" className="mr-xs">
              {test.successfixes} fixes
            </Label>
          ) : null}
          {test.success ? (
            <Label icon={<CheckCircleIcon />} color="green" className="mr-xs">
              {test.success} success
            </Label>
          ) : null}
          {test.skips ? (
            <Label
              icon={<ExclamationTriangleIcon />}
              color="orange"
              className="mr-xs"
            >
              {test.skips} skipped
            </Label>
          ) : null}
          {test.errors ? (
            <Label
              icon={<ExclamationCircleIcon />}
              color="red"
              className="mr-xs"
            >
              {test.errors} errors
            </Label>
          ) : null}
          {test.failures ? (
            <Label
              icon={<ExclamationCircleIcon />}
              color="red"
              className="mr-xs"
            >
              {test.failures} failures
            </Label>
          ) : null}
          {test.regressions ? (
            <Label icon={<ExclamationCircleIcon />} color="red">
              {test.regressions} regressions
            </Label>
          ) : null}
        </div>
        <div>
          {isLoadingTestsCases ? (
            <Button isDisabled={isLoadingTestsCases}>Loading...</Button>
          ) : seeDetails ? (
            <Button onClick={() => setSeeDetails(false)}>Hide all tests</Button>
          ) : (
            <Button
              isDisabled={isLoadingTestsCases}
              onClick={() => {
                loadTestCases();
              }}
            >
              See all tests
            </Button>
          )}
        </div>
      </TestHeader>
      {seeDetails && (
        <TestsDetails>
          {isLoadingTestsCases ? (
            <div>loading...</div>
          ) : (
            <div>
              {isEmpty(testscases) ? (
                <div>There are no test cases for this test</div>
              ) : (
                <TestsCases testscases={testscases} />
              )}
            </div>
          )}
        </TestsDetails>
      )}
    </TestDiv>
  );
}
