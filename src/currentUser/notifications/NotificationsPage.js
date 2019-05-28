import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, differenceBy } from "lodash";
import remotecisActions from "remotecis/remotecisActions";
import { getSubscribedRemotecis } from "currentUser/currentUserActions";
import { getRemotecis } from "remotecis/remotecisSelectors";
import { Page } from "layout";
import { Grid, GridItem } from "@patternfly/react-core";
import SubscribeForm from "./SubscribeForm";
import UnsubscribeForm from "./UnsubscribeForm";
import { EmptyState } from "ui";

export class NotificationsPage extends Component {
  componentDidMount() {
    const { currentUser, fetchRemotecis, getSubscribedRemotecis } = this.props;
    fetchRemotecis();
    getSubscribedRemotecis(currentUser);
  }

  render() {
    const { remotecis, currentUser, isFetching } = this.props;
    const currentRemotecis = currentUser.remotecis || [];
    const availableRemotecis = differenceBy(remotecis, currentRemotecis, "id");
    return (
      <Page
        title="Notifications"
        description="Subscribe to remotecis notifications. You will receive an email for each job in failure."
        loading={isFetching && isEmpty(availableRemotecis)}
        empty={
          !isFetching &&
          isEmpty(availableRemotecis) &&
          isEmpty(currentRemotecis)
        }
        EmptyComponent={
          <EmptyState
            title="No remoteci"
            info="There is no remoteci you can subscribe to."
          />
        }
      >
        <Grid gutter="md">
          <GridItem span={6}>
            <SubscribeForm remotecis={availableRemotecis} />
          </GridItem>
          <GridItem span={6}>
            <UnsubscribeForm remotecis={currentRemotecis} />
          </GridItem>
        </Grid>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    remotecis: getRemotecis(state),
    isFetching: state.remotecis.isFetching,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRemotecis: () => dispatch(remotecisActions.all({ embed: "team" })),
    getSubscribedRemotecis: identity =>
      dispatch(getSubscribedRemotecis(identity)),
    deleteRemoteci: remoteci => dispatch(remotecisActions.delete(remoteci))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPage);
