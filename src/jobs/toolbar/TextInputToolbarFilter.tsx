import { ToolbarFilter } from "@patternfly/react-core";
import TextInput from "./TextInput";

type TextInputToolbarFilterProps = {
  categoryName: string;
  value: string | null;
  onSubmit: (name: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function TextInputToolbarFilter({
  value,
  showToolbarItem,
  onSubmit,
  onClear,
  categoryName,
}: TextInputToolbarFilterProps) {
  return (
    <ToolbarFilter
      labels={value === null ? [] : [value]}
      deleteLabel={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TextInput value={value} name={categoryName} onClick={onSubmit} />
    </ToolbarFilter>
  );
}
