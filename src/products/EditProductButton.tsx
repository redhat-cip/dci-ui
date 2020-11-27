import React from "react";
import { useDispatch } from "react-redux";
import ProductForm from "./ProductForm";
import actions from "./productsActions";
import { EditAltIcon } from "@patternfly/react-icons";
import { IProduct } from "types";
import { AppDispatch } from "store";

interface EditProductButtonProps {
  product: IProduct;
  [x: string]: any;
}

export default function EditProductButton({
  product,
  ...props
}: EditProductButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <ProductForm
      title="Edit product"
      product={product}
      showModalButton={<EditAltIcon />}
      okButton="Edit"
      submit={(newProduct: IProduct) => {
        dispatch(
          actions.update({
            ...newProduct,
            id: product.id,
          })
        );
      }}
      {...props}
    />
  );
}
