import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Button } from "patternfly-react";
import { Select } from "../form";
import { subscribeToARemoteci } from "../currentUser/currentUserActions";

export class SubscribeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { remotecis, subscribeToARemoteci } = this.props;
    const remoteciIds = remotecis.reduce((accumulator, remoteci) => {
      accumulator[remoteci.id] = remoteci;
      return accumulator;
    }, {});
    return (
      <Formsy
        id="subscription-form"
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={remoteci => {
          subscribeToARemoteci(remoteciIds[remoteci.id]);
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
          bsStyle="primary"
          disabled={!this.state.canSubmit}
        >
          Subscribe
        </Button>
      </Formsy>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToARemoteci: remoteci => dispatch(subscribeToARemoteci(remoteci))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(SubscribeForm);
