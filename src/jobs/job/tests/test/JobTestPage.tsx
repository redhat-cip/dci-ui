import { Bullseye, Card, CardBody, CardTitle } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IFile, ITestSuite } from "types";
import { BlinkLogo, EmptyState } from "ui";
import { getFile, getJunit } from "./testActions";
import TestSuites from "./TestSuites";

export default function JobTestPage() {
  const { file_id } = useParams();
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(true);
  const [testFile, setTestFile] = useState<IFile | null>(null);
  const [testsuites, setTestsuites] = useState<ITestSuite[]>([]);

  const loadTestCases = useCallback(() => {
    if (file_id && testsuites.length === 0) {
      Promise.all([getFile(file_id), getJunit(file_id)])
        .then((results) => {
          setTestFile(results[0].data.file);
          setTestsuites(results[1].data.testsuites);
        })
        .finally(() => {
          setIsLoadingTestsCases(false);
        });
    }
  }, [file_id, testsuites]);

  useEffect(() => {
    loadTestCases();
  }, [loadTestCases]);

  if (isLoadingTestsCases) {
    return (
      <Card>
        <CardBody>
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  if (testFile === null) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Test file not found"
            info={`There is no test file with id ${file_id}`}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Test suites for {testFile.name}</CardTitle>
      <CardBody>
        <TestSuites testsuites={testsuites} />
      </CardBody>
    </Card>
  );
}
