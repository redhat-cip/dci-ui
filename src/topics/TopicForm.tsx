import { forwardRef } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { Input, SelectWithSearch, Checkbox, Select, TextArea } from "ui/formik";
import { INewTopic, ITopic, ITopicForm, IProduct, IEditTopic } from "types";

function isValidJSON(value: string | null | undefined) {
  try {
    if (value) {
      JSON.parse(value);
    }
  } catch (e) {
    return false;
  }
  return true;
}

const TopicSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Topic name is too short!")
    .required("Topic name is required"),
  product_id: Yup.string().nullable().required("Product is required"),
  export_control: Yup.boolean(),
  state: Yup.string().required(),
  component_types: Yup.string().test(
    "isJSON",
    "Component types should be a valid JSON",
    isValidJSON
  ),
  data: Yup.string().test("isJSON", "Data should be a valid JSON", isValidJSON),
});

function fromTopicToTopicForm(topic: INewTopic | IEditTopic): ITopicForm {
  return {
    ...topic,
    product_id: topic.product_id || "",
    component_types: JSON.stringify(topic.component_types),
    data: JSON.stringify(topic.data),
  };
}

function fromTopicFormToTopic(
  topic: ITopicForm
): INewTopic | IEditTopic | undefined {
  const component_types =
    topic.component_types === "" ? [] : JSON.parse(topic.component_types);
  const data = topic.data === "" ? {} : JSON.parse(topic.data);
  try {
    return {
      ...topic,
      component_types,
      data,
    };
  } catch (error) {
    console.error(error);
  }
}

interface TopicFormProps {
  topic?: ITopic;
  products: IProduct[];
  onSubmit: (topic: INewTopic | IEditTopic) => void;
}

const TopicForm = forwardRef<FormikProps<ITopicForm>, TopicFormProps>(
  ({ topic, products, onSubmit }, formRef) => (
    <Formik
      innerRef={formRef}
      initialValues={fromTopicToTopicForm(
        topic || {
          name: "",
          export_control: false,
          state: "active",
          product_id: null,
          component_types: [],
          data: {},
        }
      )}
      validationSchema={TopicSchema}
      onSubmit={(values) => {
        const newTopic = fromTopicFormToTopic(values);
        if (newTopic) {
          onSubmit(newTopic);
        }
      }}
    >
      <Form id="topic_form" className="pf-c-form">
        <Input
          id="topic_form__name"
          data-testid="topic_form__name"
          label="Name"
          name="name"
          isRequired
        />
        <SelectWithSearch
          id="topic_form__product_id"
          label="Select a product"
          placeholder="Select a product"
          name="product_id"
          options={products.map((p) => ({ label: p.name, value: p.id }))}
          isRequired
        />
        <Select
          id="topic_form__state"
          label="State"
          placeholder="State"
          name="state"
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
        <Checkbox
          id="topic_form__export_control"
          data-testid="topic_form__export_control"
          label="Export Control"
          name="export_control"
        />
        <TextArea
          id="topic_form__component_types"
          data-testid="topic_form__component_types"
          label="Component types"
          name="component_types"
          placeholder="[]"
        />
        <TextArea
          id="topic_form__data"
          data-testid="topic_form__data"
          label="Data"
          name="data"
          placeholder="{}"
        />
      </Form>
    </Formik>
  )
);

export default TopicForm;
