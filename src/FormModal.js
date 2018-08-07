import React, {Component} from "react";
import PropTypes from "prop-types";
import { Modal, Icon, Button } from "patternfly-react";

export default class ModalForm extends Component {
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
              id="submit-modal-button"
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
