import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  InputGroupItem,
} from "@patternfly/react-core";

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
        <InputGroupItem isFill>
          <TextInput
            id="test-name"
            name="test-name"
            type="text"
            aria-label={placeholder}
            onChange={(e, v) => onChange(v)}
            value={testName === null ? "" : testName}
            placeholder={placeholder}
            isRequired
          />
        </InputGroupItem>
      </InputGroup>
    </ToolbarFilter>
  );
}
