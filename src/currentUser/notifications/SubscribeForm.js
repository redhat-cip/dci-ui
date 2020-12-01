import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { Select } from "ui/form";
import { subscribeToARemoteci } from "currentUser/currentUserActions";

export class SubscribeForm extends Component {
  state = {
    canSubmit: false,
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const {
      remotecis,
      subscribeToARemoteci,
      currentUser,
      onSubmit,
    } = this.props;
    const { canSubmit } = this.state;
    const remoteciIds = remotecis.reduce((accumulator, remoteci) => {
      accumulator[remoteci.id] = remoteci;
      return accumulator;
    }, {});
    return (
      <Card>
        <CardBody>
          <Formsy
            id="subscription-form"
            className="pf-c-form"
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={(remoteci) => {
              subscribeToARemoteci(remoteciIds[remoteci.id], currentUser).then(
                () => {
                  onSubmit();
                }
              );
            }}
          >
            <Select
              id="subscription-form__subscribeSelect"
              label="Available Remotecis"
              name="id"
              options={remotecis}
              value={isEmpty(remotecis) ? null : remotecis[0].id}
              required
            />
            <Button
              id="subscription-form__submitButton"
              type="submit"
              variant="primary"
              isDisabled={!canSubmit}
            >
              Subscribe
            </Button>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToARemoteci: (remoteci, currentUser) =>
      dispatch(subscribeToARemoteci(remoteci, currentUser)),
  };
}

export default connect(null, mapDispatchToProps)(SubscribeForm);
