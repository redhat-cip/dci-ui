import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class HiddenInput extends Component {
  render() {
    const { id, name } = this.props;
    return (
      <input
        id={id || name}
        name={name}
        type="hidden"
        value={this.props.getValue() || ""}
      />
    );
  }
}

HiddenInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired
};

export default withFormsy(HiddenInput);
