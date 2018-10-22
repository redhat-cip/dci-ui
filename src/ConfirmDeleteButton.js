import React, { Component } from "react";
import ConfirmModal from "./ConfirmModal";
import { Button } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

export default class ConfirmDeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { resource, whenConfirmed, name, ...props } = this.props;
    return (
      <React.Fragment>
        <ConfirmModal
          title={`Delete ${name} ${resource.name}`}
          okButton={`Yes delete ${resource.name}`}
          cancelButton="oups no!"
          show={this.state.show}
          close={this.closeModal}
          onValidSubmit={() => {
            this.closeModal();
            whenConfirmed(resource);
          }}
        >
          {`Are you sure you want to delete ${resource.name}?`}
        </ConfirmModal>
        <Button variant="danger" onClick={this.showModal} {...props}>
          <TrashIcon />
        </Button>
      </React.Fragment>
    );
  }
}
