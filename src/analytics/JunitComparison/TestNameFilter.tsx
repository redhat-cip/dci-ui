import { ToolbarFilter, InputGroup, TextInput } from "@patternfly/react-core";

type TestNameFilterProps = {
  testName: string | null;
  onChange: (testName: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholder?: string;
  categoryName?: string;
};

export default function TestNameFilter({
  testName,
  onChange,
  onClear,
  showToolbarItem = true,
  placeholder = "Filter by test name",
  categoryName = "Test name",
}: TestNameFilterProps) {
  return (
    <ToolbarFilter
      chips={testName === null ? [] : [testName]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <InputGroup>
        <TextInput
          id="test-name"
          name="test-name"
          type="text"
          aria-label={placeholder}
          onChange={onChange}
          value={testName === null ? "" : testName}
          placeholder={placeholder}
          isRequired
        />
      </InputGroup>
    </ToolbarFilter>
  );
}
