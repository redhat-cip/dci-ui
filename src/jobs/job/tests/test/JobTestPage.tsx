import {
  Bullseye,
  Card,
  CardBody,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IFile, IGetJunitTestSuites } from "types";
import { BlinkLogo, EmptyState } from "ui";
import { getFile, getJunit } from "./testActions";
import TestSuites from "./TestSuites";

export default function JobTestPage() {
  const { file_id } = useParams();
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(true);
  const [testFile, setTestFile] = useState<IFile | null>(null);
  const [junit, setJunit] = useState<IGetJunitTestSuites | null>(null);

  const loadTestCases = useCallback(() => {
    if (file_id && junit === null) {
      Promise.all([getFile(file_id), getJunit(file_id)])
        .then((results) => {
          setTestFile(results[0].data.file);
          setJunit(results[1].data);
        })
        .finally(() => {
          setIsLoadingTestsCases(false);
        });
    }
  }, [file_id, junit]);

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
      <CardBody>
        <Content className="pf-v6-u-mb-md">
          <Content component={ContentVariants.h2}>
            Test suites for {testFile.name}
          </Content>
        </Content>
        {junit !== null && <TestSuites junit={junit} />}
      </CardBody>
    </Card>
  );
}
