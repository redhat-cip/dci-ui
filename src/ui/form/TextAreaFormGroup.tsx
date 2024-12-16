import { FormGroup, TextArea } from "@patternfly/react-core";
import { FieldError, useFormContext } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";
import { FormGroupProps } from "types";

export default function TextAreaFormGroup({
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
    <FormGroup label={label} isRequired={isRequired} fieldId={id} {...props}>
      <TextArea
        id={id}
        placeholder={placeholder}
        isRequired={isRequired}
        validated={error ? "error" : "default"}
        {...methods.register(name)}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
