import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, differenceBy } from "lodash";
import remotecisActions from "./remotecisActions";
import { getRemotecis } from "./remotecisSelectors";
import { Page } from "../layout";
import { Row, Col } from "patternfly-react";
import SubscribeForm from "./SubscribeForm";
import UnsubscribeForm from "./UnsubscribeForm";

export class NotificationsContainer extends Component {
  componentDidMount() {
    this.props.fetchRemotecis();
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
      >
        <Row className="py-5">
          <Col xs={12} md={6}>
            <SubscribeForm remotecis={availableRemotecis} />
          </Col>
        </Row>
        <Row className="pb-5">
          <Col xs={12} md={6}>
            <UnsubscribeForm remotecis={currentUser.remotecis} />
          </Col>
        </Row>
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
)(NotificationsContainer);
