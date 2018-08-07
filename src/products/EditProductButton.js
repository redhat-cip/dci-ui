import React, {Component} from "react";
import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import actions from "./producstActions";

export class EditProductButton extends Component {
  render() {
    return (
      <ProductForm
        title="Edit product"
        product={this.props.product}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={product => {
          const newProduct = {
            id: this.props.product.id,
            ...product
          };
          this.props.editProduct(newProduct);
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
