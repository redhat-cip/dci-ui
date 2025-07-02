import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";
import { Controller, useFormContext, type FieldError } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";
import type { FormGroupProps } from "types";

export default function SelectFormGroup({
  id,
  label,
  name,
  isRequired = false,
  options,
  ...props
}: {
  options: {
    label: string;
    value: string;
  }[];
} & FormGroupProps) {
  const methods = useFormContext();
  const error = methods.formState.errors[name] as FieldError;
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id} {...props}>
      <Controller
        name={name}
        control={methods.control}
        render={({ field }) => (
          <FormSelect id={id} {...field}>
            {options.map((option, index) => (
              <FormSelectOption
                key={index}
                value={option.value}
                label={option.label}
              />
            ))}
          </FormSelect>
        )}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
