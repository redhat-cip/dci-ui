import { useState } from "react";
import { useField } from "formik";
import {
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
} from "@patternfly/react-core";

type SelectOptionType = {
  label: string;
  value: string;
};

interface SelectWithSearchProps {
  id: string;
  label?: string;
  placeholder?: string;
  name: string;
  options: SelectOptionType[];
  isRequired?: boolean;
  [x: string]: any;
}

export default function SelectWithSearch({
  id,
  label,
  placeholder,
  name,
  options,
  isRequired = false,
  ...props
}: SelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const validated = meta.touched && meta.error ? "error" : "default";
  return (
    <FormGroup
      label={label}
      isRequired={isRequired}
      fieldId={id}
      helperTextInvalid={meta.error}
      validated={validated}
    >
      <Select
        {...field}
        {...props}
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={placeholder}
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          const s = selection as SelectOptionType;
          setIsOpen(false);
          setValue(s.value);
        }}
        onClear={() => setValue(null)}
        selections={
          field.value ? options.find((o) => o.value === field.value)?.label : ""
        }
        isOpen={isOpen}
        aria-labelledby={id}
        placeholderText={placeholder}
        menuAppendTo="parent"
        maxHeight="220px"
      >
        {options
          .map((o) => ({ ...o, toString: () => o.label }))
          .map((option, i) => (
            <SelectOption
              key={i}
              id={`${id}[${i}]`}
              data-testid={`${id}[${i}]`}
              value={option}
            />
          ))}
      </Select>
    </FormGroup>
  );
}
