import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  PlusIcon,
  TrashAltIcon,
} from "@patternfly/react-icons";
import {
  chart_color_purple_200,
  chart_color_purple_400,
  chart_color_blue_200,
  chart_color_blue_400,
  chart_color_orange_200,
  chart_color_orange_400,
  chart_color_green_200,
  chart_color_green_400,
  chart_color_black_400,
  chart_color_black_500,
  c_button_BorderRadius,
} from "@patternfly/react-tokens";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useModal from "hooks/useModal";

const graphTypes = ["line", "bar", "scatter"] as const;
type IGraphType = (typeof graphTypes)[number];
const graphTypeLabels: Record<IGraphType, string> = {
  scatter: "scatter chart",
  line: "line chart",
  bar: "bar chart",
};

const keyValueGraphColors = [
  chart_color_blue_200.value,
  chart_color_blue_400.value,
  chart_color_purple_200.value,
  chart_color_purple_400.value,
  chart_color_orange_200.value,
  chart_color_orange_400.value,
  chart_color_green_200.value,
  chart_color_green_400.value,
  chart_color_black_400.value,
  chart_color_black_500.value,
] as const;
type KeyValueGraphDataColor = (typeof keyValueGraphColors)[number];
interface IKeyValueGraphKey {
  color: KeyValueGraphDataColor;
  key: string;
}
export interface IKeyValueGraph {
  keys: IKeyValueGraphKey[];
  graphType: IGraphType;
}

export default function KeyValuesAddGraphModal({
  keys,
  onSubmit,
  ...props
}: {
  keys: string[];
  onSubmit: (data: IKeyValueGraph) => void;
  [key: string]: any;
}) {
  const { control, handleSubmit, setValue, watch } = useForm<IKeyValueGraph>({
    defaultValues: {
      keys: [{ key: keys[0], color: keyValueGraphColors[0] }],
      graphType: graphTypes[0],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "keys",
  });

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
          <Form
            id="add-key-value-graph"
            onSubmit={handleSubmit((newValues) => {
              hide();
              onSubmit(newValues);
            })}
          >
            <FormGroup label="Graph type" isRequired fieldId="graph-type-field">
              <Controller
                name="graphType"
                control={control}
                render={({ field }) => (
                  <FormSelect {...field} id="graph-type-select">
                    {graphTypes.map((gT, index) => (
                      <FormSelectOption
                        key={index}
                        value={gT}
                        label={graphTypeLabels[gT]}
                      />
                    ))}
                  </FormSelect>
                )}
              />
            </FormGroup>
            <FormGroup label="Keys" isRequired fieldId="graph-type-keys">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  style={{ display: "flex", gap: "1em", marginBottom: "1em" }}
                >
                  <div style={{ flex: 1 }}>
                    <Controller
                      name={`keys.${index}.key`}
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          id={`select-key-${index}`}
                          onChange={(_, v) => setValue(`keys.${index}.key`, v)}
                          value={field.value}
                        >
                          {keys.map((key, index) => (
                            <FormSelectOption
                              key={index}
                              value={key}
                              label={key}
                            />
                          ))}
                        </FormSelect>
                      )}
                    />
                  </div>
                  <div
                    style={{ display: "flex", gap: "1px", flex: "0 0 auto" }}
                  >
                    {keyValueGraphColors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setValue(`keys.${index}.color`, c)}
                        style={{
                          backgroundColor: c,
                          flex: 1,
                          color: "inherit",
                          padding: 0,
                          font: "inherit",
                          cursor: "pointer",
                          aspectRatio: "1 / 1",
                          width: "35px",
                          outline: "none",
                          border: "none",
                          borderRadius: c_button_BorderRadius.value,
                        }}
                      >
                        {watch(`keys.${index}.color`) === c && (
                          <CheckCircleIcon />
                        )}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        remove(index);
                      }}
                      variant="plain"
                    >
                      <TrashAltIcon />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pf-v6-u-mt-sm text-right">
                <Button
                  variant="control"
                  icon={<PlusIcon aria-hidden="true" />}
                  onClick={() => {
                    append({
                      key: keys[0],
                      color: keyValueGraphColors[0],
                    });
                  }}
                  title="Add another key"
                  style={{ height: "35px" }}
                >
                  New key
                </Button>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            icon={<PlusIcon aria-hidden="true" />}
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
