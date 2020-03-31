import React from "react";
import ProductForm from "./ProductForm";

const NewProductButton = ({ onSubmit, ...props }) => (
  <ProductForm
    title="Create a new product"
    showModalButton="Create a new product"
    okButton="Create"
    submit={onSubmit}
    {...props}
  />
);

export default NewProductButton;
