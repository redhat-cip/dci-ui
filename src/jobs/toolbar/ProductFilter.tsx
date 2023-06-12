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

type ProductFilterProps = {
  product_id: string | null;
  onSelect: (product: IProduct) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function ProductFilter({
  product_id,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Product",
}: ProductFilterProps) {
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
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.single}
        typeAheadAriaLabel={placeholderText}
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as IProduct;
          onSelect(s);
        }}
        selections={product === null ? "" : product.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText={placeholderText}
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
