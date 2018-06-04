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
import { Modal, Icon, Button } from "patternfly-react";

export default class ConfirmDeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show || false
    };
  }

  close = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div>
        {this.props.children}
        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Header>
            <button
              className="close"
              onClick={this.close}
              aria-hidden="true"
              aria-label="Close"
            >
              <Icon type="pf" name="close" />
            </button>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.props.body}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="default"
              className="btn-cancel"
              onClick={this.close}
            >
              {this.props.cancelButton || "cancel"}
            </Button>
            <Button bsStyle="danger" onClick={this.afterConfirmation}>
              {this.props.okButton || "ok"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ConfirmDeleteModal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  show: PropTypes.bool,
  confirmed: PropTypes.func.isRequired
};
