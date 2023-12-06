import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import { IProduct, ITopic } from "types";

interface CreateTopicModalProps {
  products: IProduct[];
  onSubmit: (topic: Partial<ITopic>) => void;
  [x: string]: any;
}

export default function CreateTopicModal({
  products,
  onSubmit,
  ...props
}: CreateTopicModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_topic_modal"
        aria-label="Create topic modal"
        variant={ModalVariant.medium}
        title="Create a new topic"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-topic-form"
          >
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <TopicForm
          id="create-topic-form"
          products={products}
          onSubmit={(topic) => {
            hide();
            onSubmit(topic);
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        Create a new topic
      </Button>
    </>
  );
}
