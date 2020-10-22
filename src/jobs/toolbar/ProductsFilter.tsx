import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getProductById } from "products/productsSelectors";
import { IProduct } from "types";
import productsActions from "products/productsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";

type ProductsFilterProps = {
  product_id: string | null;
  onSelect: (product: IProduct) => void;
  onClear: () => void;
  showToolbarItem: boolean;
};

const ProductsFilter = ({
  product_id,
  onSelect,
  onClear,
  showToolbarItem,
}: ProductsFilterProps) => {
  const products = useSelector(getProducts);
  const product = useSelector((state) => getProductById(product_id)(state));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(productsActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={product ? [product.name] : []}
      deleteChip={onClear}
      categoryName="Product"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by product..."
        onClear={onClear}
        onSelect={(p) => onSelect(p as IProduct)}
        option={product}
        options={products}
      />
    </ToolbarFilter>
  );
};

export default ProductsFilter;
