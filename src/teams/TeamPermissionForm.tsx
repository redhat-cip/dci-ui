import {
  Checkbox,
  FormGroup,
  HelperText,
  HelperTextItem,
  Skeleton,
  Text,
  TextVariants,
} from "@patternfly/react-core";
import { useFormikContext } from "formik";
import { IProduct } from "types";
import { useListProductsQuery } from "products/productsApi";

export interface TeamPermissionValues {
  permissions: {
    [productId: string]: IProduct;
  };
}

export default function TeamPermission() {
  const { values, setFieldValue } = useFormikContext<TeamPermissionValues>();
  const { data, isLoading } = useListProductsQuery();

  return (
    <>
      <Text component={TextVariants.h3}>Product permissions</Text>
      <HelperText className="pf-v5-u-mb-sm">
        <HelperTextItem>
          Select the product the team has access to:
        </HelperTextItem>
      </HelperText>
      {isLoading ? (
        <Skeleton width="25%" />
      ) : data ? (
        data.products.map((product) => {
          const id = `team_permissions_form__checkbox${product.name}`;
          const isChecked = values.permissions.hasOwnProperty(product.id);
          return (
            <FormGroup key={product.id} fieldId={id}>
              <Checkbox
                id={id}
                label={product.name}
                name="permissions"
                isChecked={isChecked}
                onChange={(e, checked) => {
                  if (checked) {
                    const permissionsWithProduct = {
                      ...values.permissions,
                      [product.id]: product,
                    };
                    setFieldValue("permissions", permissionsWithProduct);
                  } else {
                    const { [product.id]: p, ...permissionsWithoutProduct } =
                      values.permissions;
                    setFieldValue("permissions", permissionsWithoutProduct);
                  }
                }}
              />
            </FormGroup>
          );
        })
      ) : null}
    </>
  );
}
