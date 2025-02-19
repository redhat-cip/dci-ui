import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  TextInput,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  PlusIcon,
  TrashAltIcon,
} from "@patternfly/react-icons";
import { c_button_BorderRadius } from "@patternfly/react-tokens";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  graphTypeLabels,
  graphTypes,
  IKeyValueGraph,
  graphColors,
  getRandomGraphColor,
  IKeyValueGraphKey,
} from "./keyValuesTypes";
import { IGraphKeysValues } from "types";

export default function KeyValuesChartForm({
  id,
  data,
  defaultValues,
  onSubmit,
  ...props
}: {
  id: string;
  data: IGraphKeysValues;
  onSubmit: (data: IKeyValueGraph) => void;
  defaultValues?: IKeyValueGraph;
  [key: string]: any;
}) {
  const randomColor = getRandomGraphColor();
  const graph: IKeyValueGraph = defaultValues
    ? { ...defaultValues }
    : {
        group_by: "",
        keys: [{ key: data.keys[0], color: randomColor, axis: "left" }],
        graphType: graphTypes[0],
        name: `Key value graph`,
      };
  const { control, handleSubmit, setValue, watch, register } =
    useForm<IKeyValueGraph>({
      defaultValues: graph,
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "keys",
  });

  const groupByValue = watch("group_by");
  const graphKeys =
    groupByValue === undefined || groupByValue === ""
      ? data.keys
      : data.groupByKeys[groupByValue as keyof typeof data.groupByKeys];

  return (
    <Form id={id} onSubmit={handleSubmit(onSubmit)} {...props}>
      <Grid hasGutter md={6}>
        <GridItem span={12}>
          <FormGroup label="Graph name" isRequired fieldId="graph-name-field">
            <TextInput {...register("name")} />
          </FormGroup>
        </GridItem>
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
        <FormGroup label="Group by" fieldId="graph-group_by-field">
          <Controller
            name="group_by"
            control={control}
            render={({ field }) => (
              <FormSelect
                id="select-group-by"
                onChange={(_, v) => setValue(`group_by`, v)}
                value={field.value}
              >
                <FormSelectOption value="" label="" />
                {Object.keys(data.groupByKeys).map((key, index) => (
                  <FormSelectOption key={index} value={key} label={key} />
                ))}
              </FormSelect>
            )}
          />
        </FormGroup>
        <GridItem span={12}>
          <FormGroup label="Keys" isRequired fieldId="graph-type-keys">
            {fields.map((field, index) => (
              <div
                key={field.id}
                style={{ display: "flex", gap: "1em", marginBottom: "1em" }}
              >
                <div style={{ flex: 2 }}>
                  <Controller
                    name={`keys.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        id={`select-key-${index}`}
                        onChange={(_, v) => setValue(`keys.${index}.key`, v)}
                        value={field.value}
                      >
                        {graphKeys.map((key, index) => (
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
                <div style={{ flex: 1 }}>
                  <Controller
                    name={`keys.${index}.axis`}
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        id={`select-axis-${index}`}
                        onChange={(_, v) => {
                          setValue(
                            `keys.${index}.axis`,
                            v as IKeyValueGraphKey["axis"],
                          );
                        }}
                        value={field.value}
                      >
                        <FormSelectOption value="left" label="Left axis" />
                        <FormSelectOption value="right" label="Right axis" />
                      </FormSelect>
                    )}
                  />
                </div>
                <div style={{ display: "flex", gap: "1px", flex: "0 0 auto" }}>
                  {Object.values(graphColors).map(
                    ({ backgroundColor, color }, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setValue(`keys.${index}.color`, backgroundColor)
                        }
                        style={{
                          backgroundColor,
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
                        {watch(`keys.${index}.color`) === backgroundColor && (
                          <CheckCircleIcon color={color} />
                        )}
                      </button>
                    ),
                  )}
                </div>
                <div>
                  <Button onClick={() => remove(index)} variant="plain">
                    <TrashAltIcon />
                  </Button>
                </div>
              </div>
            ))}
            <div className="pf-v6-u-my-sm">
              <Button
                variant="control"
                icon={<PlusIcon aria-hidden="true" />}
                onClick={() => {
                  append({
                    key: data.keys[0],
                    color: randomColor,
                    axis: "left",
                  });
                }}
                title="Add another key"
              >
                Add a new key
              </Button>
            </div>
          </FormGroup>
        </GridItem>
      </Grid>
    </Form>
  );
}
