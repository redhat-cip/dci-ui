import React from "react";
import ProductForm from "./ProductForm";
import { EditAltIcon } from "@patternfly/react-icons";

const EditProductButton = ({ product, onSubmit, ...props }) => (
  <ProductForm
    {...props}
    title="Edit product"
    product={product}
    showModalButton={<EditAltIcon />}
    okButton="Edit"
    submit={newProduct => {
      onSubmit({
        id: product.id,
        ...newProduct
      });
    }}
  />
);

export default EditProductButton;
