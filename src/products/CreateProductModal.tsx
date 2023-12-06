import { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import ProductForm from "./ProductForm";
import { IProduct } from "types";

interface CreateProductModalProps {
  onSubmit: (product: Partial<IProduct>) => void;
  [x: string]: any;
}

export default function CreateProductModal({
  onSubmit,
  ...props
}: CreateProductModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<Partial<IProduct>>>(null);
  return (
    <>
      <Modal
        id="create_product_modal"
        aria-label="Create product modal"
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
                if (formRef.current.isValid) {
                  hide();
                }
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
      <Button variant="primary" onClick={show} {...props}>
        Create a new product
      </Button>
    </>
  );
}
