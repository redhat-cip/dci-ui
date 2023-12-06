import * as Yup from "yup";
import { useFormik } from "formik";
import { ITopic, IProduct, state } from "types";
import { Form } from "@patternfly/react-core";
import { CheckboxGroup, InputGroup, SelectGroup, TextAreaGroup } from "ui/form";

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
    isValidJSON,
  ),
  data: Yup.string().test("isJSON", "Data should be a valid JSON", isValidJSON),
});

function fromTopicToTopicForm(topic: ITopic | undefined) {
  if (!topic) {
    return {
      name: "",
      export_control: true,
      product_id: "",
      state: "active" as state,
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

interface TopicFormProps {
  id: string;
  topic?: ITopic;
  products: IProduct[];
  onSubmit: (topic: ITopic | Partial<ITopic>) => void;
}

function TopicForm({ id, topic, products, onSubmit }: TopicFormProps) {
  const formik = useFormik({
    initialValues: fromTopicToTopicForm(topic),
    validationSchema: TopicSchema,
    onSubmit: (values) => {
      return onSubmit({
        ...values,
        component_types:
          values.component_types === ""
            ? []
            : JSON.parse(values.component_types),
        data: values.data === "" ? {} : JSON.parse(values.data),
      } as ITopic);
    },
  });

  type FormField = "name" | "component_types" | "product_id" | "data";

  function isNotValid(key: FormField) {
    return formik.touched[key] && Boolean(formik.errors[key]);
  }

  function getErrorMessage(key: FormField) {
    return (formik.touched[key] && formik.errors[key]) || "";
  }

  return (
    <Form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <InputGroup
        id="topic-form-name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isRequired
        hasError={isNotValid("name")}
        errorMessage={getErrorMessage("name")}
      />
      <CheckboxGroup
        id="topic-form-export-control"
        name="export_control"
        label="Export Control"
        isChecked={formik.values.export_control}
        onChange={formik.handleChange}
      />
      <SelectGroup
        id="topic-form-product_id"
        label="Select a product"
        name="product_id"
        placeholderOption={"Select a product"}
        value={formik.values.product_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        options={products.map((p) => ({ label: p.name, value: p.id }))}
        hasError={isNotValid("product_id")}
        errorMessage={getErrorMessage("product_id")}
        isRequired
      />
      <SelectGroup
        id="topic-form-state"
        label="State"
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
        value={formik.values.state}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <InputGroup
        id="topic-form-component_types"
        name="component_types"
        label="Component types"
        value={formik.values.component_types}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        hasError={isNotValid("component_types")}
        errorMessage={getErrorMessage("component_types")}
      />
      <TextAreaGroup
        id="topic-form-data"
        name="data"
        label="Data"
        value={formik.values.data}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        hasError={isNotValid("data")}
        errorMessage={getErrorMessage("data")}
      />
    </Form>
  );
}

export default TopicForm;
