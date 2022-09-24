import JobStatesList from "jobs/job/jobStates/JobStatesList";
import { useJob } from "../jobContext";
import JobDetailsSummary from "../JobDetailsSummary";

export default function JobStatesPage() {
  const { job } = useJob();

  return (
    <div>
      <JobDetailsSummary key={job.id} job={job} />
      <JobStatesList job={job} />
    </div>
  );
}
