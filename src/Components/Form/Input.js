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

class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  changeValue = event => {
    this.props.setValue(event.currentTarget.value);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, type } = this.props;
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={name}>
          {label}
        </label>
        <input
          id={id || name}
          name={name}
          className="form-control"
          onChange={this.changeValue}
          type={type}
          value={this.props.getValue() || ""}
        />
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

Input.PropTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string
};

Input.defaultProps = {
  type: "text"
};

export default withFormsy(Input);
