import { useState } from "react";
import {
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  InputGroupItem,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

type TextInputProps = {
  categoryName: string;
  initialValue: string;
  onSubmit: (name: string) => void;
  onClear: () => void;
};

export default function DCITextInput({
  initialValue,
  onSubmit,
  categoryName,
}: TextInputProps) {
  const [innerValue, setInnerValue] = useState(initialValue);
  const lowerCategoryName = categoryName.toLowerCase();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(innerValue);
        setInnerValue("");
      }}
    >
      <InputGroup>
        <InputGroupItem isFill>
          <TextInput
            name={lowerCategoryName}
            id={`input-${lowerCategoryName}`}
            type="search"
            aria-label={`${lowerCategoryName} filter`}
            onChange={(_event, val) => setInnerValue(val)}
            value={innerValue}
            placeholder={`Filter by ${lowerCategoryName}`}
            isRequired
          />
        </InputGroupItem>
        <InputGroupItem>
          <Button
            variant={ButtonVariant.control}
            aria-label={`Search by ${lowerCategoryName} button`}
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroupItem>
      </InputGroup>
    </form>
  );
}
