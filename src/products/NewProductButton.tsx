import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { IProduct } from "types";
import ProductForm from "./ProductForm";
import actions from "./productsActions";

interface NewProductButtonProps {
  [x: string]: any;
}

export default function NewProductButton({ ...props }: NewProductButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <ProductForm
      title="Create a new product"
      showModalButton="Create a new product"
      okButton="Create"
      submit={(newProduct: IProduct) => {
        dispatch(actions.create(newProduct));
      }}
      {...props}
    />
  );
}
