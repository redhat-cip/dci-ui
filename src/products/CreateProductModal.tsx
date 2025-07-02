import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import ProductForm from "./ProductForm";
import type { IProduct } from "types";

interface CreateProductModalProps {
  onSubmit: (product: Partial<IProduct>) => void;
  [x: string]: any;
}

export default function CreateProductModal({
  onSubmit,
  ...props
}: CreateProductModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_product_modal"
        aria-label="Create product modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new product" />
        <ModalBody>
          <ProductForm
            id="create-product-form"
            onSubmit={(product) => {
              hide();
              onSubmit(product);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-product-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        Create a new product
      </Button>
    </>
  );
}
