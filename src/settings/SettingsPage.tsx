import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Grid, GridItem } from "@patternfly/react-core";
import { updateCurrentUser } from "../currentUser/currentUserActions";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import MainPage from "pages/MainPage";
import { AppDispatch } from "store";
import { useAuth } from "auth/authContext";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { Breadcrumb } from "ui";

export default function SettingsPage() {
  const { refreshIdentity } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getCurrentUser);
  if (currentUser === null) return null;
  return (
    <MainPage
      title="User preferences"
      description="Edit your preferences"
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "User preferences" }]}
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
                onSubmit={(newCurrentUser) =>
                  dispatch(updateCurrentUser(newCurrentUser)).then(
                    refreshIdentity
                  )
                }
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
                  onSubmit={(newCurrentUser) => {
                    dispatch(updateCurrentUser(newCurrentUser)).then(
                      refreshIdentity
                    );
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </MainPage>
  );
}
