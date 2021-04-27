import * as React from "react";
import { useField } from "formik";
import {
  FormSelectOption,
  FormSelect,
  FormGroup,
} from "@patternfly/react-core";

interface CustomSelectProps {
  id: string;
  label?: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange?: (v: string, e: React.FormEvent<HTMLSelectElement>) => void;
  [x: string]: any;
}

export default function CustomSelect({
  id,
  label,
  name,
  options,
  ...props
}: CustomSelectProps) {
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
      <FormSelect
        {...field}
        {...props}
        id={id}
        onChange={(value, event) => {
          setValue(value);
          if (typeof props.onChange !== "undefined") {
            props.onChange(value, event);
          }
        }}
      >
        {options.map((option, index) => (
          <FormSelectOption
            key={index}
            value={option.value}
            label={option.label}
          />
        ))}
      </FormSelect>
    </FormGroup>
  );
}
