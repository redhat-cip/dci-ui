import { ToolbarFilter } from "@patternfly/react-core";
import ProductSelect from "./ProductSelect";
import type { IProduct, IToolbarFilterProps } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProductQuery } from "products/productsApi";

export default function ProductToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: IToolbarFilterProps<IProduct>) {
  const { data: product, isFetching } = useGetProductQuery(id ? id : skipToken);
  const labels = isFetching
    ? ["..."]
    : id === null || !product
      ? []
      : [product.name];
  return (
    <ToolbarFilter
      labels={labels}
      categoryName="Product name"
      deleteLabel={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <ProductSelect
        onClear={onClear}
        onSelect={(product) => {
          if (product) {
            onSelect(product);
          }
        }}
        placeholder={placeholder}
      />
    </ToolbarFilter>
  );
}
