import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Checkbox extends Component {
  changeValue = event => {
    const { setValue } = this.props;
    setValue(event.currentTarget.checked);
  };

  render() {
    const {
      id,
      label,
      name,
      required = false,
      getErrorMessage,
      getValue
    } = this.props;
    const errorMessage = getErrorMessage();
    return (
      <div className="pf-c-form__group">
        <label htmlFor={name}>
          <input
            id={id || name}
            type="checkbox"
            name={name}
            value={getValue()}
            checked={!!getValue()}
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
