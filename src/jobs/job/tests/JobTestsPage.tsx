import TestsList from "jobs/job/tests/TestsList";
import { useJob } from "../jobContext";

export default function JobTestsPage() {
  const { job } = useJob();

  return <TestsList tests={job.tests} />;
}
