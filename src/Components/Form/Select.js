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
import { withFormsy } from "formsy-react";

class Select extends React.Component {
  constructor(props) {
    super(props);
  }

  changeValue = event => {
    this.props.setValue(event.currentTarget.value || null);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { label, name } = this.props;
    return (
      <div className="form-group">
        <label>{label}</label>
        <select
          id={name}
          name={name}
          value={this.props.getValue() || this.props.defaultValue}
          onChange={this.changeValue}
          className="form-control"
        >
          {this.props.required ? null : <option value="" />}
          {this.props.options.map((option, i) => (
            <option key={i} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(Select);
