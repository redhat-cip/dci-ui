import React, { Component } from "react";
import { withFormsy } from "formsy-react";

class HiddenInput extends Component {
  render() {
    const { id, name, getValue } = this.props;
    return (
      <input
        id={id || name}
        name={name}
        type="hidden"
        value={getValue() || ""}
      />
    );
  }
}

export default withFormsy(HiddenInput);
