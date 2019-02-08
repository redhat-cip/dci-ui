import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Input extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.value);
  };

  render() {
    const {
      id,
      label,
      name,
      type,
      required = false,
      getErrorMessage,
      getValue
    } = this.props;
    const errorMessage = getErrorMessage();

    return (
      <div className="pf-c-form__group">
        <label className="pf-c-form__label" htmlFor={name}>
          {label}
          {required ? (
            <span className="pf-c-form__label__required" aria-hidden="true">
              &#42;
            </span>
          ) : null}
        </label>
        <input
          id={id || name}
          name={name}
          className="pf-c-form-control"
          onChange={this.changeValue}
          type={type}
          value={getValue() || ""}
        />
        <p className="pf-c-form__helper-text pf-m-error">{errorMessage}</p>
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string
};

Input.defaultProps = {
  type: "text"
};

export default withFormsy(Input);
