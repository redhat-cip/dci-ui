import React from "react";
import { FormGroup, TextArea, TextAreaProps } from "@patternfly/react-core";
import { useField } from "formik";

type DCITextAreaProps = {
  label: string;
  id: string;
  name: string;
} & TextAreaProps;

export default function DCITextArea({
  label,
  id,
  name,
  ref,
  ...props
}: DCITextAreaProps) {
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
      <TextArea
        id={id}
        {...field}
        {...props}
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
