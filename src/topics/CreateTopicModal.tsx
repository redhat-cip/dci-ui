import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import { INewTopic, IProduct, ITopicForm, ICurrentUser } from "types";

interface CreateTopicModalProps {
  products: IProduct[];
  onSubmit: (topic: INewTopic) => void;
}

export default function CreateTopicModal({
  products,
  onSubmit,
}: CreateTopicModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<ITopicForm>>(null);
  return (
    <>
      <Modal
        id="create_topic_modal"
        variant={ModalVariant.medium}
        title="Create a new topic"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            onClick={() => {
              if (formRef.current) {
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
        <TopicForm
          ref={formRef}
          products={products}
          onSubmit={onSubmit}
        />
      </Modal>
      <Button variant="primary" onClick={show}>
        Create a new topic
      </Button>
    </>
  );
}
