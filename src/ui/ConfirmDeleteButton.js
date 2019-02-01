import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

export default class ConfirmDeleteButton extends Component {
  state = {
    show: false
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const {
      title,
      content,
      okButton = "yes",
      cancelButton = "oups no!",
      whenConfirmed,
      ...props
    } = this.props;
    const { show } = this.state;
    return (
      <React.Fragment>
        <Modal
          title={title}
          isOpen={show}
          onClose={this.closeModal}
          isLarge
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              className="btn-cancel"
              onClick={this.closeModal}
            >
              {cancelButton}
            </Button>,
            <Button
              key="ok"
              variant="danger"
              onClick={() => {
                this.closeModal();
                whenConfirmed();
              }}
            >
              {okButton}
            </Button>
          ]}
        >
          {content ? content : ""}
        </Modal>
        <Button variant="danger" onClick={this.showModal} {...props}>
          <TrashIcon />
        </Button>
      </React.Fragment>
    );
  }
}
