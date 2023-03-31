import { Bullseye, Card, CardBody } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IFile, ITestSuite } from "types";
import { BlinkLogo } from "ui";
import { getJunit } from "./testActions";
import TestSuites from "./TestSuites";

export default function JobTestPage() {
  const { file_id } = useParams();
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(true);
  const [testsuites, setTestsuites] = useState<ITestSuite[]>([]);

  const loadTestCases = useCallback(() => {
    if (testsuites.length === 0) {
      setIsLoadingTestsCases(true);
      const file = { id: file_id } as IFile;
      getJunit(file)
        .then((r) => {
          setTestsuites(r.data.testsuites);
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

  return <TestSuites testsuites={testsuites} />;
}
