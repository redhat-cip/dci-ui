import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Grid, GridItem } from "@patternfly/react-core";
import { updateCurrentUser } from "../currentUserActions";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Page } from "layout";
import { AppDispatch, RootState } from "store";
import { useAuth } from "auth/authContext";

export default function SettingsPage() {
  const { refreshIdentity } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <Page title="User preferences">
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
    </Page>
  );
}
