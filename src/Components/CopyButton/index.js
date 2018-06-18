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
import copy from "copy-text-to-clipboard";

export default class CopyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.titleBefore
    };
  }

  copyText = () => {
    copy(this.props.text);
    this.setState({ title: this.props.titleAfter });
    setTimeout(() => {
      this.setState({ title: this.props.titleBefore });
    }, 2000);
  };

  render() {
    return (
      <span
        data-balloon={this.state.title}
        data-balloon-pos={this.props.position}
        onClick={() => this.copyText()}
      >
        <i className="fa fa-fw fa-clipboard pointer" />
      </span>
    );
  }
}

CopyButton.propTypes = {
  titleBefore: PropTypes.string,
  titleAfter: PropTypes.string,
  position: PropTypes.string,
  text: PropTypes.string.isRequired
};

CopyButton.defaultProps = {
  titleBefore: "Click to copy",
  titleAfter: "Copied!",
  position: "right"
};
