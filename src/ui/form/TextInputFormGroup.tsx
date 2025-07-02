import {
  FormGroup,
  TextInput,
  ValidatedOptions,
  type TextInputProps,
} from "@patternfly/react-core";
import { useFormContext, type FieldError } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";
import type { FormGroupProps } from "types";

export default function TextInputFormGroup({
  id,
  label,
  name,
  isRequired = false,
  placeholder = "",
  type = "text",
  ...props
}: { type?: TextInputProps["type"] } & FormGroupProps) {
  const methods = useFormContext();
  const error = methods.formState.errors[name] as FieldError;
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id} {...props}>
      <TextInput
        id={id}
        placeholder={placeholder}
        isRequired={isRequired}
        validated={error ? ValidatedOptions.error : ValidatedOptions.default}
        type={type}
        {...methods.register(name)}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
