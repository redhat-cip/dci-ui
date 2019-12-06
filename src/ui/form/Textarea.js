import React, { Component } from "react";
import { withFormsy } from "formsy-react";

class Textarea extends Component {
  changeValue = event => {
    const { setValue } = this.props;
    setValue(event.currentTarget.value);
  };

  render() {
    const {
      id,
      label,
      name,
      required = false,
      getErrorMessage,
      getValue,
      placeholder
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
        <textarea
          id={id || name}
          name={name}
          className="pf-c-form-control"
          onChange={this.changeValue}
          value={getValue() || ""}
          placeholder={placeholder}
        />
        <span className="pf-c-form__helper-text pf-m-error">
          {errorMessage}
        </span>
      </div>
    );
  }
}

export default withFormsy(Textarea);
