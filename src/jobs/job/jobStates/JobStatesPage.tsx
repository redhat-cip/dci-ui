import JobStatesList from "jobs/job/jobStates/JobStatesList";
import { useJob } from "../jobContext";
import JobDetailsHeader from "../JobDetailsHeader";

export default function JobStatesPage() {
  const { job } = useJob();

  return (
    <div>
      <JobDetailsHeader key={job.id} job={job} />
      <JobStatesList job={job} />
    </div>
  );
}
