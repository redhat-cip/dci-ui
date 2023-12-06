import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextArea,
  TextAreaProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export default function TextAreaGroup({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
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
  onChange: TextAreaProps["onChange"];
  onBlur: TextAreaProps["onBlur"];
  placeholder?: string;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  [k: string]: any;
}) {
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <TextArea
        isRequired={isRequired}
        type="text"
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
