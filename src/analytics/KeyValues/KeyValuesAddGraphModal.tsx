import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";

import useModal from "hooks/useModal";
import KeyValuesChartForm from "./KeyValuesChartForm";
import type { IKeyValueGraph } from "./keyValuesTypes";

export default function KeyValuesAddGraphModal({
  keys,
  onSubmit,
  ...props
}: {
  keys: string[];
  onSubmit: (graph: IKeyValueGraph) => void;
  [key: string]: any;
}) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="add-new-graph"
        aria-label="Add new key value graph"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Add a graph" />
        <ModalBody>
          <KeyValuesChartForm
            id="add-key-value-graph"
            keys={keys}
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
            form="add-key-value-graph"
          >
            Add new graph
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<PlusIcon aria-hidden="true" />}
        variant="control"
        onClick={show}
        {...props}
      >
        Add new graph
      </Button>
    </>
  );
}
