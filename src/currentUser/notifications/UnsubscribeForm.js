import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Button, Card, CardBody, Form } from "@patternfly/react-core";
import { Select } from "ui/form";
import { unsubscribeFromARemoteci } from "currentUser/currentUserActions";

export class UnsubscribeForm extends Component {
  state = {
    canSubmit: false
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { remotecis, unsubscribeFromARemoteci } = this.props;
    const { canSubmit } = this.state;
    const remoteciIds = remotecis.reduce((accumulator, remoteci) => {
      accumulator[remoteci.id] = remoteci;
      return accumulator;
    }, {});
    return (
      <Card>
        <CardBody>
          <Formsy
            id="unsubscription-form"
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={remoteci =>
              unsubscribeFromARemoteci(remoteciIds[remoteci.id])
            }
          >
            <Form>
              <Select
                id="unsubscription-form__unsubscribeSelect"
                label="Subscribed RemoteCI"
                name="id"
                value={isEmpty(remotecis) ? null : remotecis[0].id}
                options={remotecis}
                required
              />
              <Button
                id="unsubscription-form__submitButton"
                type="submit"
                variant="secondary"
                isDisabled={!canSubmit}
              >
                Unsubscribe
              </Button>
            </Form>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    unsubscribeFromARemoteci: remoteci =>
      dispatch(unsubscribeFromARemoteci(remoteci))
  };
}

export default connect(null, mapDispatchToProps)(UnsubscribeForm);
