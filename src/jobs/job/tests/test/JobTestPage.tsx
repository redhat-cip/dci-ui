import {
  Bullseye,
  Card,
  CardBody,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import { useParams } from "react-router";
import { BlinkLogo, EmptyState } from "ui";
import TestSuites from "./TestSuites";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetJunitQuery } from "../testsApi";

export default function JobTestPage() {
  const { file_id } = useParams();
  const { data: junit, isLoading } = useGetJunitQuery(
    file_id ? file_id : skipToken,
  );

  if (isLoading) {
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

  if (!junit) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="JUnit not found"
            info={`There is no junit file with id ${file_id}`}
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
            Test suites for file id: {file_id}
          </Content>
        </Content>
        {junit !== null && <TestSuites junit={junit} />}
      </CardBody>
    </Card>
  );
}
