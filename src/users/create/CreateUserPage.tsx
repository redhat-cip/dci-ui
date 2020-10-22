import React from "react";
import { useDispatch } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { Page } from "layout";
import usersActions from "../usersActions";
import CreateUserForm from "./CreateUserForm";
import { AppDispatch } from "store";
import { useHistory } from "react-router-dom";

export default function CreateUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  return (
    <Page title="Create a user">
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <CreateUserForm
                onSubmit={(user) => {
                  dispatch(usersActions.create(user)).then(() =>
                    history.push("/users")
                  );
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Page>
  );
}
