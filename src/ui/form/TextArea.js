import React, { Component } from "react";
import { withFormsy } from "formsy-react";
import { FormGroup, TextArea } from "@patternfly/react-core";

class DCITextArea extends Component {
  handleTextAreaChange = (value) => {
    const { setValue } = this.props;
    setValue(value);
  };

  render() {
    const {
      id,
      label,
      name,
      type,
      required = false,
      errorMessage,
      isValid,
      value,
      placeholder,
      helperText = "",
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
        <TextArea
          isRequired={required}
          type={type}
          id={id || name}
          name={name}
          value={value || ""}
          onChange={this.handleTextAreaChange}
          placeholder={placeholder}
        />
      </FormGroup>
    );
  }
}

export default withFormsy(DCITextArea);
