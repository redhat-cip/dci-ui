import { Card, CardBody } from "@patternfly/react-core";
import TestsList from "jobs/job/tests/TestsList";
import { useJob } from "../jobContext";

export default function JobTestsPage() {
  const { job } = useJob();

  return (
    <Card>
      <CardBody>
        <TestsList tests={job.tests} />
      </CardBody>
    </Card>
  );
}
