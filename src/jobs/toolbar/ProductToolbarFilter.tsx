import { IProduct, SelectProps } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import ProductSelect from "./ProductSelect";

export default function ProductToolbarFilter({
  id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: SelectProps<IProduct>) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      deleteChip={onClear}
      categoryName="Product id"
      showToolbarItem={showToolbarItem}
    >
      <ProductSelect id={id} onSelect={onSelect} onClear={onClear} />
    </ToolbarFilter>
  );
}
