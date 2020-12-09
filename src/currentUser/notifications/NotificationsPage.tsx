import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, differenceBy } from "lodash";
import remotecisActions from "remotecis/remotecisActions";
import {
  getSubscribedRemotecis,
  unsubscribeFromARemoteci,
  subscribeToARemoteci,
} from "currentUser/currentUserActions";
import {
  getRemotecis,
  isFetchingRemotecis,
} from "remotecis/remotecisSelectors";
import { Page } from "layout";
import { Grid, GridItem } from "@patternfly/react-core";
import SubscribeForm from "./SubscribeForm";
import UnsubscribeForm from "./UnsubscribeForm";
import { EmptyState } from "ui";
import { AppDispatch } from "store";
import { IRemoteci } from "types";
import { getCurrentUser } from "../currentUserSelectors";

export default function NotificationsPage() {
  const remotecis = useSelector(getRemotecis);
  const isFetching = useSelector(isFetchingRemotecis);
  const currentUser = useSelector(getCurrentUser);
  const [currentRemotecis, setCurrentRemotecis] = useState<IRemoteci[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(remotecisActions.all({ embed: "team" }));
  }, [dispatch]);

  const getSubscribedRemotecisCallback = useCallback(() => {
    if (currentUser !== null) {
      dispatch(getSubscribedRemotecis(currentUser)).then((response) => {
        setCurrentRemotecis(response.data.remotecis);
      });
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    getSubscribedRemotecisCallback();
  }, [getSubscribedRemotecisCallback]);

  const availableRemotecis = differenceBy(remotecis, currentRemotecis, "id");
  if (currentUser === null) return null;
  return (
    <Page
      title="Notifications"
      description="Subscribe to remotecis notifications. You will receive an email for each job in failure."
      loading={isFetching && isEmpty(availableRemotecis)}
      empty={
        !isFetching && isEmpty(availableRemotecis) && isEmpty(currentRemotecis)
      }
      EmptyComponent={
        <EmptyState
          title="No remoteci"
          info="There is no remoteci you can subscribe to."
        />
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <SubscribeForm
            remotecis={availableRemotecis}
            onSubmit={({ remoteci_id }) => {
              dispatch(subscribeToARemoteci(remoteci_id, currentUser)).then(
                getSubscribedRemotecisCallback
              );
            }}
          />
        </GridItem>
        <GridItem span={6}>
          <UnsubscribeForm
            remotecis={currentRemotecis}
            onSubmit={({ remoteci_id }) => {
              dispatch(unsubscribeFromARemoteci(remoteci_id, currentUser)).then(
                getSubscribedRemotecisCallback
              );
            }}
          />
        </GridItem>
      </Grid>
    </Page>
  );
}
