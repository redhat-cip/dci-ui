import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getProductById } from "products/productsSelectors";
import { IProduct } from "types";
import productsActions from "products/productsActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
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
  const [isOpen, setIsOpen] = useState(false);
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
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Filter by product"
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as IProduct;
          onSelect(s);
        }}
        onClear={onClear}
        selections={product === null ? "" : product.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by product"
        maxHeight="220px"
      >
        {products
          .map((p) => ({ ...p, toString: () => p.name }))
          .map((product) => (
            <SelectOption key={product.id} value={product} />
          ))}
      </Select>
    </ToolbarFilter>
  );
}
