import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import ProductForm from "./ProductForm";
import { INewProduct } from "types";

interface CreateProductModalProps {
  onSubmit: (product: INewProduct) => void;
}

export default function CreateProductModal({
  onSubmit,
}: CreateProductModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewProduct>>(null);
  return (
    <>
      <Modal
        id="create_product_modal"
        variant={ModalVariant.medium}
        title="Create a new product"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            onClick={() => {
              if (formRef.current) {
                hide();
                formRef.current.handleSubmit();
              }
            }}
          >
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <ProductForm ref={formRef} onSubmit={onSubmit} />
      </Modal>
      <Button variant="primary" onClick={show}>
        Create a new product
      </Button>
    </>
  );
}
