import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import { ITopic, IProduct } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditTopicModalProps {
  products: IProduct[];
  topic: ITopic;
  onSubmit: (topic: ITopic | Partial<ITopic>) => void;
  [x: string]: any;
}

export default function EditTopicModal({
  products,
  topic,
  onSubmit,
  ...props
}: EditTopicModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="edit-topic-modal"
        aria-label="Edit topic modal"
        variant={ModalVariant.medium}
        title={`Edit topic ${topic.name}`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-topic-form"
          >
            Edit
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <TopicForm
          id="edit-topic-form"
          products={products}
          topic={topic}
          onSubmit={(topic) => {
            hide();
            onSubmit(topic);
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" className="pf-v5-u-mr-xs" />
        Edit {topic.name}
      </Button>
    </>
  );
}
