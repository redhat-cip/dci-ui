import { useState } from "react";
import { ToolbarFilter } from "@patternfly/react-core";
import TextInput from "./TextInput";

type ListToolbarFilterProps = {
  showToolbarItem?: boolean;
  items: string[];
  categoryName: string;
  placeholderText: string;
  onSubmit: (items: string[]) => void;
};

export default function ListToolbarFilter({
  showToolbarItem = true,
  items,
  onSubmit,
  categoryName,
}: ListToolbarFilterProps) {
  const [value, setValue] = useState("");
  const uniqItems = [...new Set(items)];
  return (
    <ToolbarFilter
      labels={uniqItems}
      deleteLabel={(key, value) => {
        if (key) {
          onSubmit(uniqItems?.filter((f) => f !== value));
        }
      }}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TextInput
        value={value}
        name={categoryName.toLowerCase()}
        onClick={(newValue) => {
          if (uniqItems?.indexOf(newValue) === -1) {
            onSubmit(uniqItems.concat(newValue));
            setValue("");
          }
        }}
      />
    </ToolbarFilter>
  );
}
