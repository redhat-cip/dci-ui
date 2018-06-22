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

export default class ModalForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Modal show={this.props.show} onHide={this.props.close}>
          <Modal.Header>
            <button
              className="close"
              onClick={this.props.close}
              aria-hidden="true"
              aria-label="Close"
            >
              <Icon type="pf" name="close" />
            </button>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.children}</Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="default"
              className="btn-cancel"
              onClick={this.props.close}
            >
              {this.props.cancelButton}
            </Button>
            <Button
              bsStyle="primary"
              type="submit"
              form={this.props.formRef}
              disabled={!this.props.canSubmit}
            >
              {this.props.okButton}
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

ModalForm.propTypes = {
  title: PropTypes.string.isRequired,
  formRef: PropTypes.string.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  show: PropTypes.bool,
  canSubmit: PropTypes.bool,
  close: PropTypes.func
};

ModalForm.defaultProps = {
  show: false,
  okButton: "create",
  cancelButton: "cancel"
};
