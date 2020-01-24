import React, { Component } from "react";
import { withFormsy } from "formsy-react";
import { FormGroup, TextArea } from "@patternfly/react-core";

class DCITextArea extends Component {
  handleTextAreaChange = value => {
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
      getErrorMessage,
      isValid,
      getValue,
      placeholder,
      helperText = ""
    } = this.props;
    return (
      <FormGroup
        label={label}
        isRequired={required}
        fieldId={id || name}
        helperText={helperText}
        helperTextInvalid={getErrorMessage()}
        isValid={isValid()}
      >
        <TextArea
          isRequired={required}
          type={type}
          id={id || name}
          name={name}
          value={getValue() || ""}
          onChange={this.handleTextAreaChange}
          placeholder={placeholder}
        />
      </FormGroup>
    );
  }
}

export default withFormsy(DCITextArea);
