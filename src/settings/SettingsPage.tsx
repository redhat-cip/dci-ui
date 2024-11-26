import {
  Card,
  CardBody,
  Content,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useAuth } from "auth/authSelectors";
import { Breadcrumb } from "ui";
import { useUpdateCurrentUserMutation } from "auth/authApi";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [updateCurrentUser] = useUpdateCurrentUserMutation();

  if (currentUser === null) return null;

  return (
    <PageSection>
      <Breadcrumb
        links={[{ to: "/", title: "DCI" }, { title: "My profile" }]}
      />
      <Content component="h1">My profile</Content>
      <Content component="p">Edit your profile</Content>
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <SettingsForm
                key={`SettingsForm.${currentUser.id}.${currentUser.etag}`}
                currentUser={currentUser}
                onSubmit={updateCurrentUser}
              />
            </CardBody>
          </Card>
        </GridItem>
        {currentUser.isReadOnly ? null : (
          <GridItem span={6}>
            <Card>
              <CardBody>
                <ChangePasswordForm
                  key={`ChangePasswordForm.${currentUser.id}.${currentUser.etag}`}
                  currentUser={currentUser}
                  onSubmit={updateCurrentUser}
                />
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </PageSection>
  );
}
