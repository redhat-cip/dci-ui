import React, { Component } from "react";
import { withFormsy, addValidationRule } from "formsy-react";
import { FormGroup, TextArea } from "@patternfly/react-core";

addValidationRule("isJSON", function (values, value) {
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

class TextAreaJSON extends Component {
  state = {
    value: "{}",
  };

  componentDidMount() {
    const { value = {}, setValue } = this.props;
    setValue(value);
    this.setState({ value: JSON.stringify(value) });
  }

  handleTextAreaChange = (value) => {
    const { isValidValue, setValue } = this.props;
    if (isValidValue(value)) {
      setValue(JSON.parse(value));
    } else {
      setValue(value);
    }
    this.setState({ value: value });
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
      placeholder,
      helperText = "",
    } = this.props;
    const { value } = this.state;
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
          value={value}
          onChange={this.handleTextAreaChange}
          placeholder={placeholder}
        />
      </FormGroup>
    );
  }
}

export default withFormsy(TextAreaJSON);
