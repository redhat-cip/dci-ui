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
  return (
    <>
      <Modal
        id="edit_product_modal"
        aria-label="Edit product modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title={`Edit ${product.name}`} />
        <ModalBody>
          <ProductForm
            id="edit-product-form"
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
        </ModalBody>
        <ModalFooter>
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-product-form"
          >
            Edit
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<EditAltIcon aria-hidden="true" />}
        variant="link"
        onClick={show}
        {...props}
      ></Button>
    </>
  );
}
