import { Button, Flex, FlexItem, Label } from "@patternfly/react-core";
import { useCallback, useState } from "react";
import { IFile, ITest, ITestSuite } from "types";
import { humanizeDuration } from "services/date";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CaretDownIcon,
  CaretRightIcon,
} from "@patternfly/react-icons";
import { getJunit } from "./testsActions";
import TestSuites from "./TestSuites";

interface TestProps {
  test: ITest;
}

export default function Test({ test }: TestProps) {
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(false);
  const [seeDetails, setSeeDetails] = useState(false);
  const [testsuites, setTestsuites] = useState<ITestSuite[]>([]);

  const loadTestCases = useCallback(() => {
    if (testsuites.length === 0) {
      setIsLoadingTestsCases(true);
      const file = { id: test.file_id } as IFile;
      getJunit(file)
        .then((r) => {
          setTestsuites(r.data.testsuites);
        })
        .finally(() => {
          setIsLoadingTestsCases(false);
        });
    }
  }, [test.file_id, testsuites]);

  return (
    <div>
      <Flex>
        <FlexItem flex={{ default: "flex_3" }}>
          <Button
            variant="link"
            onClick={() => {
              setSeeDetails(!seeDetails);
              loadTestCases();
            }}
            style={{ display: "flex", alignItems: "center", padding: 0 }}
          >
            {seeDetails ? (
              <CaretDownIcon className="mr-xs" />
            ) : (
              <CaretRightIcon className="mr-xs" />
            )}

            {test.name || "Test"}
          </Button>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          {humanizeDuration(test.time)}
        </FlexItem>
        <FlexItem flex={{ default: "flex_2" }}>
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
        </FlexItem>
      </Flex>
      <div>
        {seeDetails ? (
          isLoadingTestsCases ? (
            <span>Loading...</span>
          ) : (
            <TestSuites testsuites={testsuites} />
          )
        ) : null}
      </div>
    </div>
  );
}
