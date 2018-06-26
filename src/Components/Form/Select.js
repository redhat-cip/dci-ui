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
import { withFormsy } from "formsy-react";

class Select extends React.Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.value || null);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, required, options } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
          id={id || name}
          name={name}
          value={this.props.getValue() || ""}
          onChange={this.changeValue}
          className="form-control"
        >
          {required ? null : <option value="" />}
          {options.map((option, i) => (
            <option key={i} value={option.id} name={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="help-block">{errorMessage}</span>
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
