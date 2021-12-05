import JobStatesList from "jobs/job/jobStates/JobStatesList";
import { useJob } from "../jobContext";

export default function JobStatesPage() {
  const { job } = useJob();

  return <JobStatesList job={job} />;
}
