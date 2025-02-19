import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import { PenIcon } from "@patternfly/react-icons";

import useModal from "hooks/useModal";
import KeyValuesChartForm from "./KeyValuesChartForm";
import { IKeyValueGraph } from "./keyValuesTypes";
import { IGraphKeysValues } from "types";

export default function KeyValuesEditGraphModal({
  data,
  onSubmit,
  graph,
  ...props
}: {
  data: IGraphKeysValues;
  graph: IKeyValueGraph;
  onSubmit: (data: IKeyValueGraph) => void;
  [key: string]: any;
}) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="edit-new-graph"
        aria-label="Add new key value graph"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Add a graph" />
        <ModalBody>
          <KeyValuesChartForm
            id="edit-key-value-graph"
            data={data}
            defaultValues={graph}
            onSubmit={(values) => {
              hide();
              onSubmit(values);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="edit-key-value-graph"
          >
            Save
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<PenIcon aria-hidden="true" />}
        onClick={show}
        variant="plain"
        {...props}
      ></Button>
    </>
  );
}
