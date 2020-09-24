import React, { Component } from "react";
import { withFormsy } from "formsy-react";
import { FormGroup, Checkbox } from "@patternfly/react-core";

class DCICheckbox extends Component {
  handleCheckboxChange = (value) => {
    const { setValue } = this.props;
    setValue(value);
  };

  render() {
    const { id, label, name, value } = this.props;
    return (
      <FormGroup fieldId={id || name}>
        <Checkbox
          id={id || name}
          name={name}
          label={label}
          isChecked={value}
          onChange={this.handleCheckboxChange}
        />
      </FormGroup>
    );
  }
}

export default withFormsy(DCICheckbox);
