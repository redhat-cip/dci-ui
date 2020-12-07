import React from "react";
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

interface DCISelectProps2 {
  id: string;
  label?: string;
  placeholder?: string;
  name: string;
  options: SelectOptionType[];
  [x: string]: any;
}

export default function DCISelect({
  id,
  label,
  placeholder,
  name,
  options,
  ...props
}: DCISelectProps2) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const validated = meta.touched && meta.error ? "error" : "default";
  return (
    <FormGroup
      label={label}
      isRequired={props.isRequired}
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
