import React from "react";
import { useField } from "formik";
import { Checkbox, FormGroup, CheckboxProps } from "@patternfly/react-core";

type DCICheckboxProps = {
  label?: string;
  id: string;
  name: string;
} & CheckboxProps;

export default function DCICheckbox({
  label,
  id,
  name,
  ref,
  ...props
}: DCICheckboxProps) {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const validated = meta.touched && meta.error ? "error" : "default";
  return (
    <FormGroup
      fieldId={id}
      helperTextInvalid={meta.error}
      validated={validated}
    >
      <Checkbox
        id={id}
        label={label}
        {...field}
        {...props}
        isChecked={field.value}
        onChange={(checked, event) => {
          setValue(checked);
          if (typeof props.onChange !== "undefined") {
            props.onChange(checked, event);
          }
        }}
      />
    </FormGroup>
  );
}
