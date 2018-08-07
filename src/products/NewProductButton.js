import React, {Component} from "react";
import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import actions from "./producstActions";

export class NewProductButton extends Component {
  render() {
    return (
      <ProductForm
        title="Create a new product"
        showModalButton="Create a new product"
        okButton="Create"
        submit={this.props.createProduct}
        className={this.props.className}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createProduct: product => dispatch(actions.create(product))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewProductButton);
