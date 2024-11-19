import { ToolbarFilter } from "@patternfly/react-core";
import TextInput from "./TextInput";

type TextInputToolbarFilterProps = {
  categoryName: string;
  name: string | null;
  onSubmit: (name: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function TextInputToolbarFilter({
  name,
  showToolbarItem,
  onSubmit,
  onClear,
  categoryName,
}: TextInputToolbarFilterProps) {
  return (
    <ToolbarFilter
      labels={name === null ? [] : [name]}
      deleteLabel={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TextInput
        initialValue={name || ""}
        categoryName={categoryName}
        onSubmit={onSubmit}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
