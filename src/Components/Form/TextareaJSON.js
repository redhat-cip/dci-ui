// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
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

class TextareaJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "{}"
    };
  }

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
    const { id, label, name } = this.props;
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={name}>
          {label}
        </label>
        <textarea
          id={id || name}
          name={name}
          className="form-control"
          onChange={this.changeValue}
          rows="5"
          value={this.state.value}
        />
        <span className="help-block">{errorMessage}</span>
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
