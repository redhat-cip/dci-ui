import React, { Component } from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";

class Select extends Component {
  handleSelectChange = (value) => {
    const { setValue } = this.props;
    setValue(value);
  };

  render() {
    const {
      id,
      label,
      name,
      required,
      options,
      helperText,
      errorMessage,
      isValid,
      value,
    } = this.props;
    return (
      <FormGroup
        label={label}
        isRequired={required}
        fieldId={id || name}
        helperText={helperText}
        helperTextInvalid={errorMessage}
        validated={isValid ? "success" : "error"}
      >
        <FormSelect
          value={value || ""}
          onChange={this.handleSelectChange}
          id={id || name}
          name={name}
        >
          {options.map((option, index) => (
            <FormSelectOption
              key={index}
              value={option.id}
              label={option.name}
            />
          ))}
        </FormSelect>
      </FormGroup>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default withFormsy(Select);
