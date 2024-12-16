import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProductQuery, useListProductsQuery } from "products/productsApi";
import { IProduct } from "types";
import Select from "ui/form/Select";

export default function ProductSelect({
  onSelect,
  onClear,
  id = "product-select",
  value,
  ...props
}: {
  onSelect: (item: IProduct | null) => void;
  onClear?: () => void;
  value?: string;
  id?: string;
  [key: string]: any;
}) {
  const { data, isFetching } = useListProductsQuery();
  const { data: product } = useGetProductQuery(value ? value : skipToken);
  const products = data?.products || [];
  return (
    <Select
      placeholder="Select a product"
      onClear={onClear}
      onSelect={(selectedProduct) => {
        if (selectedProduct) {
          onSelect(selectedProduct);
        }
      }}
      item={
        product
          ? {
              ...product,
              label: product.name,
              value: product.id,
            }
          : undefined
      }
      items={products.map((p) => ({ ...p, label: p.name, value: p.id }))}
      isLoading={isFetching}
      {...props}
    />
  );
}
