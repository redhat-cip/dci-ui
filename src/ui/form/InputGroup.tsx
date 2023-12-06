import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextInputProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export default function InputGroup({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder = "",
  isRequired = false,
  hasError = false,
  errorMessage = "",
  ...props
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: TextInputProps["onChange"];
  onBlur: TextInputProps["onBlur"];
  type?: TextInputProps["type"];
  placeholder?: string;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  [key: string]: any;
}) {
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <TextInput
        isRequired={isRequired}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        validated={hasError ? "error" : "default"}
        placeholder={placeholder}
        {...props}
      />
      {hasError && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
              {errorMessage}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
}
