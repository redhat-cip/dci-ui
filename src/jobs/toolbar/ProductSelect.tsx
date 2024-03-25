import { useListProductsQuery } from "products/productsApi";
import Select from "ui/form/Select";
import { SelectProps, IProduct } from "types";

export default function ProductSelect({
  id,
  onSelect,
  onClear,
}: SelectProps<IProduct>) {
  const { data, isFetching } = useListProductsQuery();
  const products = data?.products || [];
  const product = products.find((p) => p.id === id) || null;
  return (
    <Select
      placeholder="Select a product"
      onClear={onClear}
      onSelect={(item) => {
        const selectedProduct =
          item && products.find((r) => r.id === item.value);
        if (selectedProduct) {
          onSelect(selectedProduct);
        }
      }}
      item={
        id
          ? product === null
            ? { value: id, label: "" }
            : { value: product.id, label: product.name }
          : null
      }
      items={products.map((product) => ({
        value: product.id,
        label: product.name,
      }))}
      isLoading={isFetching}
    />
  );
}
