import { Checkbox, FormGroup } from "@patternfly/react-core";
import { Controller, useFormContext, type FieldError } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";
import type { FormGroupProps } from "types";

export default function CheckboxFormGroup({
  id,
  label,
  name,
  isRequired = false,
  placeholder = "",
  ...props
}: FormGroupProps) {
  const methods = useFormContext();
  const error = methods.formState.errors[name] as FieldError;
  return (
    <FormGroup isRequired={isRequired} fieldId={id} {...props}>
      <Controller
        name={name}
        control={methods.control}
        render={({ field }) => {
          const { value, ...rest } = field;
          return (
            <Checkbox
              label={label}
              id={id}
              placeholder={placeholder}
              isRequired={isRequired}
              isChecked={value}
              {...rest}
            />
          );
        }}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
