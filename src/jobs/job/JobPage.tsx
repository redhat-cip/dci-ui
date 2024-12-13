import { Outlet } from "react-router";
import { JobProvider } from "./jobContext";

export default function JobPage() {
  return (
    <JobProvider>
      <Outlet />
    </JobProvider>
  );
}
