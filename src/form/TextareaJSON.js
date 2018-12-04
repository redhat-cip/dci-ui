import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy, addValidationRule } from "formsy-react";

addValidationRule("isJSON", function(values, value) {
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }
  return true;
});

class TextareaJSON extends Component {
  state = {
    value: "{}"
  };

  componentDidMount() {
    const value = this.props.value || {};
    this.props.setValue(value);
    this.setState({ value: JSON.stringify(value) });
  }

  changeValue = event => {
    const text = event.currentTarget.value;
    if (this.props.isValidValue(text)) {
      this.props.setValue(JSON.parse(text));
    } else {
      this.props.setValue(text);
    }
    this.setState({ value: text });
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, required = false } = this.props;
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
          rows="5"
          value={this.state.value}
        />
        <span className="pf-c-form__helper-text pf-m-error">
          {errorMessage}
        </span>
      </div>
    );
  }
}

TextareaJSON.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default withFormsy(TextareaJSON);
