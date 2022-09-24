import { Card, CardTitle, CardBody } from "@patternfly/react-core";
import FilesList from "jobs/job/files/FilesList";
import { useJob } from "../jobContext";

export default function JobFilesPage() {
  const { job } = useJob();

  return (
    <Card>
      <CardTitle>Files</CardTitle>
      <CardBody>
        <FilesList job={job} />
      </CardBody>
    </Card>
  );
}
