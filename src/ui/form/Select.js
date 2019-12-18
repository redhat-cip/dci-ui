import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Select extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.value || null);
  };

  render() {
    const {
      id,
      label,
      name,
      required,
      options,
      getErrorMessage,
      getValue
    } = this.props;
    const errorMessage = getErrorMessage();

    return (
      <div className="pf-c-form__group">
        <label htmlFor={name}>{label}</label>
        <select
          id={id || name}
          name={name}
          value={getValue() || ""}
          onBlur={this.changeValue}
          onChange={this.changeValue}
          className="pf-c-form-control"
        >
          {required ? null : <option value="" />}
          {options.map((option, i) => (
            <option key={i} value={option.id} name={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="pf-c-form__helper-text pf-m-error">
          {errorMessage}
        </span>
      </div>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

export default withFormsy(Select);
