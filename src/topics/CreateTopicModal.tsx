import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import type { ITopic } from "types";

interface CreateTopicModalProps {
  onSubmit: (topic: Partial<ITopic>) => void;
  [x: string]: any;
}

export default function CreateTopicModal({
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
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new topic" />
        <ModalBody>
          <TopicForm
            id="create-topic-form"
            onSubmit={(topic) => {
              hide();
              onSubmit(topic);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-topic-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        Create a new topic
      </Button>
    </>
  );
}
