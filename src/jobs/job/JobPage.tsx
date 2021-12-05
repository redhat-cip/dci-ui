import { JobProvider } from "./jobContext";
import JobPageWithMenu from "./JobPageWithMenu";

export default function JobPage() {
  return (
    <JobProvider>
      <JobPageWithMenu />
    </JobProvider>
  );
}
