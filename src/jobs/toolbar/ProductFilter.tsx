import { useState } from "react";
import { IProduct } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { useListProductsQuery } from "products/productsApi";
import { useGetUserQuery } from "users/usersApi";
import { skipToken } from "@reduxjs/toolkit/query";

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
  const [isOpen, setIsOpen] = useState(false);
  const { data: product } = useGetUserQuery(
    product_id ? product_id : skipToken,
  );
  const { data } = useListProductsQuery();
  if (!data) return null;
  return (
    <ToolbarFilter
      chips={product === undefined ? [] : [product.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.single}
        typeAheadAriaLabel={placeholderText}
        onToggle={(_event, val) => setIsOpen(val)}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as IProduct;
          onSelect(s);
        }}
        selections={product === undefined ? "" : product.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText={placeholderText}
      >
        {data.products
          .map((p) => ({ ...p, toString: () => p.name }))
          .map((product) => (
            <SelectOption key={product.id} value={product} />
          ))}
      </Select>
    </ToolbarFilter>
  );
}
