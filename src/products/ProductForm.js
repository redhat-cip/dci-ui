import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, HiddenInput, FormModal } from "ui/form";

export default class ProductForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    product: {
      name: "",
      ...this.props.product
    }
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { title, okButton, submit, className, showModalButton } = this.props;
    const { canSubmit, show, product } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="product-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="product-form"
            className="pf-c-form"
            onValidSubmit={product => {
              this.closeModal();
              submit(product);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="product-form__etag"
              name="etag"
              value={product.etag}
            />
            <Input
              id="product-form__name"
              label="Name"
              name="name"
              value={product.name}
              required
            />
            <Input
              id="product-form__description"
              label="Description"
              name="description"
              value={product.description || ""}
            />
          </Formsy>
        </FormModal>
        <Button
          variant="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
