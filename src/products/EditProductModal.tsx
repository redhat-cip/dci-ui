import { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import ProductForm from "./ProductForm";
import { IProduct } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditProductModalProps {
  product: IProduct;
  onSubmit: (product: IProduct | Partial<IProduct>) => void;
  [x: string]: any;
}

export default function EditProductModal({
  product,
  onSubmit,
  ...props
}: EditProductModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<IProduct | Partial<IProduct>>>(null);
  return (
    <>
      <Modal
        id="edit_product_modal"
        aria-label="Edit product modal"
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
                if (formRef.current.isValid) {
                  hide();
                }
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
        <ProductForm
          ref={formRef}
          product={product}
          onSubmit={(editedProduct) => {
            // why ? dci-control-server api doesnt accept extra field like from_now
            const { id, etag, name, description } =
              editedProduct as Partial<IProduct>;
            onSubmit({
              id,
              etag,
              name,
              description,
            });
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" />
        <span className="sr-only">Edit {product.name}</span>
      </Button>
    </>
  );
}
