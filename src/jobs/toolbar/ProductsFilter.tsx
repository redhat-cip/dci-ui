import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getProductById } from "products/productsSelectors";
import { IProduct } from "types";
import productsActions from "products/productsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { AppDispatch } from "store";

type ProductsFilterProps = {
  product_id: string | null;
  onSelect: (product: IProduct) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function ProductsFilter({
  product_id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: ProductsFilterProps) {
  const products = useSelector(getProducts);
  const product = useSelector(getProductById(product_id));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(productsActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={product === null ? [] : [product.name]}
      deleteChip={onClear}
      categoryName="Product"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by product"
        onClear={onClear}
        onSelect={(p) => onSelect(p as IProduct)}
        option={product}
        options={products}
      />
    </ToolbarFilter>
  );
}
