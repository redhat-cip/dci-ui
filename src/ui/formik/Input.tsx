import React from "react";
import { useField } from "formik";
import { FormGroup, TextInput, TextInputProps } from "@patternfly/react-core";

type InputProps = {
  label?: string;
  id: string;
  name: string;
} & TextInputProps;

export default function Input({ label, id, name, ...props }: InputProps) {
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
      <TextInput
        id={id}
        {...field}
        {...props}
        validated={validated}
        onChange={(value, event) => {
          if (typeof props.onChange === "undefined") {
            setValue(value);
          } else {
            props.onChange(value, event);
          }
        }}
      />
    </FormGroup>
  );
}
