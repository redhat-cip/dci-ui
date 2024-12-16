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
import { ITopic } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditTopicModalProps {
  topic: ITopic;
  onSubmit: (topic: ITopic | Partial<ITopic>) => void;
  [x: string]: any;
}

export default function EditTopicModal({
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
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title={`Edit topic ${topic.name}`} />
        <ModalBody>
          <TopicForm
            id="edit-topic-form"
            topic={topic}
            onSubmit={(topic) => {
              hide();
              onSubmit(topic);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-topic-form"
          >
            Edit
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<EditAltIcon aria-hidden="true" className="pf-v6-u-mr-xs" />}
        variant="primary"
        onClick={show}
        {...props}
      >
        Edit {topic.name}
      </Button>
    </>
  );
}
