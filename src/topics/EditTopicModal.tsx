import { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TopicForm from "./TopicForm";
import { ITopicForm, ITopic, IProduct, IEditTopic } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditTopicModalProps {
  products: IProduct[];
  topic: ITopic;
  onSubmit: (topic: IEditTopic) => void;
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
        <TopicForm
          ref={formRef}
          products={products}
          topic={topic}
          onSubmit={(editedTopic) => {
            // why ? dci-control-server api doesnt accept extra field like from_now
            const {
              id,
              etag,
              name,
              export_control,
              state,
              product_id,
              component_types,
              data,
            } = editedTopic as IEditTopic;
            onSubmit({
              id,
              etag,
              name,
              export_control,
              state,
              product_id,
              component_types,
              data,
            });
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" className="mr-xs" />
        Edit {topic.name}
      </Button>
    </>
  );
}
