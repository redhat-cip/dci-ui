import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, isFetchingProducts } from "products/productsSelectors";
import productsActions from "products/productsActions";
import { AppDispatch } from "store";
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

export interface TeamPermissionValues {
  permissions: {
    [productId: string]: IProduct;
  };
}

export default function TeamPermission() {
  const { values, setFieldValue } = useFormikContext<TeamPermissionValues>();
  const products = useSelector(getProducts);
  const isFetching = useSelector(isFetchingProducts);
  const dispatch = useDispatch<AppDispatch>();

  const getAllProducts = useCallback(() => {
    dispatch(productsActions.all());
  }, [dispatch]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <>
      <Text component={TextVariants.h3}>Product permissions</Text>
      <HelperText className="pf-u-mb-sm">
        <HelperTextItem>
          Select the product the team has access to:
        </HelperTextItem>
      </HelperText>
      {isFetching ? (
        <Skeleton width="25%" />
      ) : (
        products.map((product) => {
          const id = `team_permissions_form__checkbox${product.name}`;
          const isChecked = values.permissions.hasOwnProperty(product.id);
          return (
            <FormGroup key={product.id} fieldId={id}>
              <Checkbox
                id={id}
                label={product.name}
                name="permissions"
                isChecked={isChecked}
                onChange={(checked, e) => {
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
      )}
    </>
  );
}
