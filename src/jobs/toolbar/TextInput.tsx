import { useState } from "react";
import {
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  InputGroupItem,
} from "@patternfly/react-core";
import { ArrowRightIcon } from "@patternfly/react-icons";

type TextInputProps = {
  value: string | null;
  name: string;
  onClick: (name: string) => void;
};

export default function DCITextInput({ value, onClick, name }: TextInputProps) {
  const [innerValue, setInnerValue] = useState(value || "");
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          name={name}
          id={`input-${name}`}
          type="text"
          aria-label={`${name} filter`}
          onChange={(_event, val) => setInnerValue(val)}
          value={innerValue}
          placeholder={`Filter by ${name}`}
          isRequired
        />
      </InputGroupItem>
      <InputGroupItem>
        <Button
          icon={<ArrowRightIcon />}
          variant={ButtonVariant.control}
          aria-label={`Search by ${name} button`}
          onClick={() => {
            onClick(innerValue);
          }}
        ></Button>
      </InputGroupItem>
    </InputGroup>
  );
}
