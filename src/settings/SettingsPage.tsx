import { Card, CardBody, Grid, GridItem } from "@patternfly/react-core";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import MainPage from "pages/MainPage";
import { useAuth } from "auth/authContext";
import { Breadcrumb } from "ui";

export default function SettingsPage() {
  const { currentUser, updateCurrentUser, changePassword } = useAuth();
  if (currentUser === null) return null;
  return (
    <MainPage
      title="My profile"
      description="Edit your profile"
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "My profile" }]}
        />
      }
    >
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
                  onSubmit={changePassword}
                />
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </MainPage>
  );
}
