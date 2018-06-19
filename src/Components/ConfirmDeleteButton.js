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

export default class ConfirmDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show
    };
  }

  close = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <React.Fragment>
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
              {this.props.cancelButton}
            </Button>
            <Button
              bsStyle="danger"
              onClick={() => {
                this.setState({ show: false });
                this.props.whenConfirmed();
              }}
            >
              {this.props.okButton}
            </Button>
          </Modal.Footer>
        </Modal>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => this.setState({ show: true })}
        >
          <i className="fa fa-trash" />
        </button>
      </React.Fragment>
    );
  }
}

ConfirmDeleteButton.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  show: PropTypes.bool,
  whenConfirmed: PropTypes.func.isRequired
};

ConfirmDeleteButton.defaultProps = {
  show: false,
  okButton: "ok",
  cancelButton: "cancel"
};
