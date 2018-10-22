import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Checkbox extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.checked);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, required = false } = this.props;
    return (
      <div className="pf-c-form__group">
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
          {required ? (
            <span className="pf-c-form__label__required" aria-hidden="true">
              &#42;
            </span>
          ) : null}
        </label>
        <span className="pf-c-form__helper-text pf-m-error">
          {errorMessage}
        </span>
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
