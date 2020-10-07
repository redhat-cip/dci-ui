import React from "react";
import { History } from "history";
import { useDispatch } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { Page } from "layout";
import usersActions from "../usersActions";
import CreateUserForm from "./CreateUserForm";
import { AppDispatch } from "store";

type CreateUserPageProps = {
  history: History;
};

export default function CreateUserPage({ history }: CreateUserPageProps) {
  const dispatch = useDispatch<AppDispatch>();
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
