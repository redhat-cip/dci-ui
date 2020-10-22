import React from "react";
import { useField } from "formik";
import { FormGroup, TextInput, TextInputProps } from "@patternfly/react-core";

type MyTextInputProps = {
  label: string;
  id: string;
  name: string;
} & TextInputProps;

export default function Input({ label, id, name, ...props }: MyTextInputProps) {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  return (
    <FormGroup
      label={label}
      isRequired={props.isRequired}
      fieldId={id}
      helperTextInvalid={meta.error}
      validated={meta.touched && meta.error ? "error" : "success"}
    >
      <TextInput
        id={id}
        {...field}
        {...props}
        onChange={(value) => setValue(value)}
      />
    </FormGroup>
  );
}
