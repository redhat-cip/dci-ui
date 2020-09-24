import React, { Component } from "react";
import { withFormsy } from "formsy-react";

class HiddenInput extends Component {
  render() {
    const { id, name, value } = this.props;
    return (
      <input id={id || name} name={name} type="hidden" value={value || ""} />
    );
  }
}

export default withFormsy(HiddenInput);
