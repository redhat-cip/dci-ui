import FilesList from "jobs/job/files/FilesList";
import { useJob } from "../jobContext";

export default function JobFilesPage() {
  const { job } = useJob();

  return <FilesList job={job} />;
}
