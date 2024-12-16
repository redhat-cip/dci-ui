import * as Yup from "yup";
import { IProduct } from "types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import { Form } from "@patternfly/react-core";

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name is too short!"),
  description: Yup.string(),
});

export default function ProductForm({
  id,
  product,
  onSubmit,
  ...props
}: {
  id: string;
  product?: IProduct;
  onSubmit: (values: IProduct | Partial<IProduct>) => void;
  [key: string]: any;
}) {
  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues: product || { name: "", description: "" },
  });
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <TextInputFormGroup
          label="Name"
          id="product_form__name"
          name="name"
          isRequired
        />
        <TextInputFormGroup
          id="product_form__description"
          label="Description"
          name="description"
        />
      </Form>
    </FormProvider>
  );
}
