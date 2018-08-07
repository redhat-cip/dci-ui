import React, {Component} from "react";
import { Button } from "patternfly-react";
import ConfirmModal from "./ConfirmModal";

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
    const { resource, whenConfirmed, name } = this.props;
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
        <Button bsStyle="danger" onClick={this.showModal}>
          <i className="fa fa-trash" />
        </Button>
      </React.Fragment>
    );
  }
}
