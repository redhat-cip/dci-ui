import React, { Component } from "react";
import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import actions from "./producstActions";

export class EditProductButton extends Component {
  render() {
    const { product, editProduct, ...props } = this.props;
    return (
      <ProductForm
        {...props}
        title="Edit product"
        product={product}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={newProduct => {
          editProduct({
            id: product.id,
            ...newProduct
          });
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editProduct: product => dispatch(actions.update(product))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditProductButton);
