import React, { Component } from "react";
import {isEmpty} from "lodash-es";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Button } from "patternfly-react";
import { Select } from "../form";
import { unsubscribeFromARemoteci } from "../currentUser/currentUserActions";

export class UnsubscribeForm extends Component {
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
    const { remotecis, unsubscribeFromARemoteci } = this.props;
    const remoteciIds = remotecis.reduce((accumulator, remoteci) => {
      accumulator[remoteci.id] = remoteci;
      return accumulator;
    }, {});
    return (
      <Formsy
        id="unsubscription-form"
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={remoteci =>
          unsubscribeFromARemoteci(remoteciIds[remoteci.id])
        }
      >
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
          bsStyle="warning"
          disabled={!this.state.canSubmit}
        >
          Unsubscribe
        </Button>
      </Formsy>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    unsubscribeFromARemoteci: remoteci =>
      dispatch(unsubscribeFromARemoteci(remoteci))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(UnsubscribeForm);
