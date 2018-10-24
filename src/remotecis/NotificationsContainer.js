import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, differenceBy } from "lodash";
import remotecisActions from "./remotecisActions";
import { getRemotecis } from "./remotecisSelectors";
import { MainContentWithLoader } from "../layout";
import {
  Row,
  Col,
  Card,
  CardHeading,
  CardTitle,
  CardBody
} from "patternfly-react";
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
      <MainContentWithLoader
        loading={isFetching && isEmpty(availableRemotecis)}
      >
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <CardHeading>
                <CardTitle>Notifications</CardTitle>
              </CardHeading>
              <CardBody>
                <p>
                  Subscribe to remotecis notifications. You will receive an
                  email for each job in failure.
                </p>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </MainContentWithLoader>
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
