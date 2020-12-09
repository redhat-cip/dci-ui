import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import ProductForm from "./ProductForm";
import { INewProduct, IProduct } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditProductModalProps {
  product: IProduct;
  onSubmit: (product: INewProduct) => void;
  [x: string]: any;
}

export default function EditProductModal({
  product,
  onSubmit,
  ...props
}: EditProductModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewProduct>>(null);
  return (
    <>
      <Modal
        id="edit_product_modal"
        variant={ModalVariant.medium}
        title={`Edit ${product.name}`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="edit"
            variant="primary"
            onClick={() => {
              if (formRef.current) {
                formRef.current.handleSubmit();
              }
            }}
          >
            Edit
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <ProductForm ref={formRef} product={product} onSubmit={onSubmit} />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" />
        <span className="sr-only">Edit {product.name}</span>
      </Button>
    </>
  );
}
