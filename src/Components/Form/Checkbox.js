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

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  changeValue = event => {
    this.props.setValue(event.currentTarget.checked);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>
          <input
            id={id || name}
            type="checkbox"
            name={name}
            value={this.props.getValue()}
            checked={!!this.props.getValue()}
            onChange={this.changeValue}
          />
          {label}
        </label>
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

Checkbox.PropTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default withFormsy(Checkbox);
