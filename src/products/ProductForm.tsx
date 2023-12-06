import { forwardRef } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { Input } from "ui/formik";
import { IProduct } from "types";

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Product name is too short!")
    .required("Product name is required"),
  description: Yup.string(),
});

interface ProductFormProps {
  product?: IProduct;
  onSubmit: (product: IProduct | Partial<IProduct>) => void;
}

const ProductForm = forwardRef<
  FormikProps<IProduct | Partial<IProduct>>,
  ProductFormProps
>(({ product, onSubmit }, formRef) => (
  <Formik
    innerRef={formRef}
    initialValues={product || { name: "", description: "" }}
    validationSchema={ProductSchema}
    onSubmit={onSubmit}
  >
    <Form id="product_form" className="pf-v5-c-form">
      <Input
        id="product_form__name"
        data-testid="product_form__name"
        label="Name"
        name="name"
        isRequired
      />
      <Input
        id="product_form__description"
        data-testid="product_form__description"
        label="Description"
        name="description"
      />
    </Form>
  </Formik>
));

export default ProductForm;
