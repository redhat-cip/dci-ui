import { useState } from "react";
import { ToolbarFilter, SearchInput } from "@patternfly/react-core";

type InputFilterProps = {
  search: string;
  placeholder: string;
  onSearch: (search: string) => void;
};

export default function InputFilter({
  search,
  placeholder,
  onSearch,
}: InputFilterProps) {
  const [input, setInput] = useState(search);
  return (
    <ToolbarFilter categoryName="Input" showToolbarItem>
      <SearchInput
        placeholder={placeholder}
        value={input}
        onChange={(e, value) => setInput(value)}
        onSearch={(e, value) => {
          onSearch(value);
        }}
        onClear={() => setInput("")}
      />
    </ToolbarFilter>
  );
}
