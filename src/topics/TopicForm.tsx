import * as Yup from "yup";
import type { ITopic } from "types";
import { Form, FormGroup } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import CheckboxFormGroup from "ui/form/CheckboxFormGroup";
import FormErrorMessage from "ui/form/FormErrorMessage";
import ProductSelect from "products/form/ProductSelect";
import SelectFormGroup from "ui/form/SelectFormGroup";
import TextAreaFormGroup from "ui/form/TextAreaFormGroup";

function isValidJSON(value: string | null | undefined) {
  try {
    if (value) {
      JSON.parse(value);
    }
  } catch {
    return false;
  }
  return true;
}

const TopicSchema = Yup.object().shape({
  name: Yup.string()
    .required("Topic name is required")
    .min(2, "Topic name is too short!"),
  product_id: Yup.string().nullable().required("Product is required"),
  export_control: Yup.boolean().required(),
  state: Yup.string().required(),
  component_types: Yup.string().test(
    "isJSON",
    "Component types should be a valid JSON",
    isValidJSON,
  ),
  data: Yup.string().test("isJSON", "Data should be a valid JSON", isValidJSON),
});

interface ITopicForm {
  name: string;
  export_control: boolean;
  product_id: string;
  state: string;
  component_types: string;
  data: string;
}

function fromTopicToTopicForm(topic: ITopic | undefined): ITopicForm {
  if (!topic) {
    return {
      name: "",
      export_control: true,
      product_id: "",
      state: "active",
      component_types: "[]",
      data: "{}",
    };
  }
  return {
    ...topic,
    component_types: JSON.stringify(topic.component_types),
    data: JSON.stringify(topic.data),
  };
}

export default function TopicForm({
  id,
  topic,
  onSubmit,
  ...props
}: {
  id: string;
  topic?: ITopic;
  onSubmit: (values: ITopic) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(TopicSchema),
    defaultValues: fromTopicToTopicForm(topic),
  });
  const productIdError = methods.formState.errors.product_id;

  return (
    <FormProvider {...methods}>
      <Form
        id={id}
        onSubmit={methods.handleSubmit((values) => {
          const { component_types, data, ...rest } = values;
          return onSubmit({
            ...rest,
            component_types:
              component_types === undefined ? [] : JSON.parse(component_types),
            data: data === undefined ? {} : JSON.parse(data),
          } as ITopic);
        })}
        {...props}
      >
        <TextInputFormGroup
          label="Name"
          id="topic_form__name"
          name="name"
          isRequired
        />
        <CheckboxFormGroup
          id="topic_form__export-control"
          name="export_control"
          label="Export Control"
        />
        <FormGroup label="Team" isRequired fieldId="remoteci_form__product_id">
          <ProductSelect
            id="topic_form__product_id"
            value={topic ? topic.product_id : undefined}
            placeholder="Select a product"
            hasError={productIdError !== undefined}
            onSelect={(item) => {
              if (item) {
                methods.setValue("product_id", item.id, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
          <FormErrorMessage error={productIdError} />
        </FormGroup>
        <SelectFormGroup
          id="topic_form__state"
          label="State"
          name="state"
          isRequired
          options={[
            {
              label: "active",
              value: "active",
            },
            {
              label: "inactive",
              value: "inactive",
            },
          ]}
        />
        <TextInputFormGroup
          id="topic_form__component_types"
          name="component_types"
          label="Component types"
        />
        <TextAreaFormGroup id="topic_form__data" name="data" label="Data" />
      </Form>
    </FormProvider>
  );
}
