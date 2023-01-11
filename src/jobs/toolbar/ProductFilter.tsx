import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProducts,
  getProductById,
  isFetchingProducts,
} from "products/productsSelectors";
import { IProduct } from "types";
import productsActions from "products/productsActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";

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
  const [searchValue, setSearchValue] = useState("");
  const products = useSelector(getProducts);
  const product = useSelector(getProductById(product_id));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(isFetchingProducts);

  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    if (debouncedSearchValue) {
      dispatch(productsActions.all({ where: `name:${debouncedSearchValue}*` }));
    }
  }, [debouncedSearchValue, dispatch]);

  return (
    <ToolbarFilter
      chips={product === null ? [] : [product.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={placeholderText}
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
        placeholderText={placeholderText}
        maxHeight="220px"
        onTypeaheadInputChanged={setSearchValue}
        noResultsFoundText={
          debouncedSearchValue === ""
            ? "Search a product by name"
            : isFetching
            ? "Searching..."
            : "No product matching this name"
        }
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
