import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, differenceBy } from "lodash";
import remotecisActions from "./remotecisActions";
import { getRemotecis } from "./remotecisSelectors";
import { Page } from "layout";
import { Grid, GridItem } from "@patternfly/react-core";
import SubscribeForm from "./SubscribeForm";
import UnsubscribeForm from "./UnsubscribeForm";
import { EmptyState } from "ui";

export class NotificationsPage extends Component {
  componentDidMount() {
    const { fetchRemotecis } = this.props;
    fetchRemotecis();
  }

  render() {
    const { remotecis, currentUser, isFetching } = this.props;
    const availableRemotecis = differenceBy(
      remotecis,
      currentUser.remotecis,
      "id"
    );
    return (
      <Page
        title="Notifications"
        description="Subscribe to remotecis notifications. You will receive an email for each job in failure."
        loading={isFetching && isEmpty(availableRemotecis)}
        empty={
          !isFetching &&
          isEmpty(availableRemotecis) &&
          isEmpty(currentUser.remotecis)
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
            <UnsubscribeForm remotecis={currentUser.remotecis} />
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
    fetchRemotecis: () => {
      dispatch(remotecisActions.all({ embed: "team" }));
    },
    deleteRemoteci: remoteci => dispatch(remotecisActions.delete(remoteci))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPage);
