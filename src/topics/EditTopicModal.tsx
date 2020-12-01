import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import { ITopicForm, ITopic, IProduct } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditTopicModalProps {
  products: IProduct[];
  topic: ITopic;
  onSubmit: (topic: ITopic) => void;
  [x: string]: any;
}

export default function EditTopicModal({
  products,
  topic,
  onSubmit,
  ...props
}: EditTopicModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<ITopicForm>>(null);
  return (
    <>
      <Modal
        id="edit_topic_modal"
        variant={ModalVariant.medium}
        title={`Edit ${topic.name}`}
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
        <TopicForm
          ref={formRef}
          products={products}
          topic={topic}
          onSubmit={(editedTopic) => {
            onSubmit(editedTopic as ITopic);
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" />
        <span className="sr-only">Edit {topic.name}</span>
      </Button>
    </>
  );
}
