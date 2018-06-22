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

class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  changeValue = event => {
    this.props.setValue(event.currentTarget.value);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const label = this.props.label;
    return (
      <div className="form-group">
        <label className="control-label" id={label}>
          {label}
        </label>
        <input
          id={label}
          name={label}
          className="form-control"
          onChange={this.changeValue}
          type="text"
          value={this.props.getValue() || ""}
        />
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(Input);
