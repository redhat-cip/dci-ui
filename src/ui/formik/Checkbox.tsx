import React from "react";
import { useField } from "formik";
import { Checkbox, FormGroup, CheckboxProps } from "@patternfly/react-core";

type DCICheckboxProps = {
  label: string;
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
  const [field, _, helpers] = useField(name);
  const { setValue } = helpers;
  return (
    <FormGroup fieldId={id}>
      <Checkbox
        id={id}
        label={label}
        {...field}
        {...props}
        onChange={(value) => setValue(value)}
      />
    </FormGroup>
  );
}
