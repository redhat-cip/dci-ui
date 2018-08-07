import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Checkbox extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.checked);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>
          <input
            id={id || name}
            type="checkbox"
            name={name}
            value={this.props.getValue()}
            checked={!!this.props.getValue()}
            onChange={this.changeValue}
          />
          {label}
        </label>
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default withFormsy(Checkbox);
