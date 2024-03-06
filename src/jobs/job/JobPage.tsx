import { Outlet } from "react-router-dom";
import { JobProvider } from "./jobContext";

export default function JobPage() {
  return (
    <JobProvider>
      <Outlet />
    </JobProvider>
  );
}
