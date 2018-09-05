import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Icon, Button } from "patternfly-react";

export default class ConfirmModal extends Component {
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
            <Button bsStyle="danger" onClick={this.props.onValidSubmit}>
              {this.props.okButton}
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  show: PropTypes.bool,
  close: PropTypes.func,
  onValidSubmit: PropTypes.func.isRequired
};

ConfirmModal.defaultProps = {
  show: false,
  okButton: "ok",
  cancelButton: "cancel"
};
