import React, { Component } from "react";
import { withFormsy } from "formsy-react";
import { FormGroup, TextInput } from "@patternfly/react-core";

class Input extends Component {
  handleTextInputChange = (value) => {
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
      helperText = "",
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
        <TextInput
          isRequired={required}
          type={type}
          id={id || name}
          name={name}
          value={getValue() || ""}
          onChange={this.handleTextInputChange}
          placeholder={placeholder}
        />
      </FormGroup>
    );
  }
}

export default withFormsy(Input);
