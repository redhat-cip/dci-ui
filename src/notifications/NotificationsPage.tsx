import MainPage from "pages/MainPage";
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import NewFailedJobSubscriptionPanel from "./NewFailedJobSubscriptionPanel";
import NewComponentSubscriptionPanel from "./NewComponentSubscriptionPanel";
import { useAuth } from "auth/authSelectors";

export default function NotificationsPage() {
  const { currentUser } = useAuth();

  if (currentUser === null) {
    return null;
  }

  return (
    <MainPage
      title="Notifications"
      description="Be notified by email when certain events appear"
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Notifications" }]}
        />
      }
    >
      <Card>
        <CardTitle>New failed job on a remoteci</CardTitle>
        <CardHeader>Get notified when a job fails.</CardHeader>
        <CardBody>
          <NewFailedJobSubscriptionPanel currentUser={currentUser} />
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md">
        <CardTitle>New component on a topic</CardTitle>
        <CardHeader>
          Get notified when a new component is created for a topic.
        </CardHeader>
        <CardBody>
          <NewComponentSubscriptionPanel />
        </CardBody>
      </Card>
    </MainPage>
  );
}
