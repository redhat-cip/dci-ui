import { Outlet } from "react-router-dom";
import { Page } from "@patternfly/react-core";

export default function NotAuthenticatedLayout({ ...props }) {
  return (
    <Page header={null} sidebar={null} {...props}>
      <Outlet />
    </Page>
  );
}
