import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  FormSelect,
  FormSelectOption,
  FormSelectProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export default function SelectGroup({
  id,
  name,
  label,
  value,
  placeholderOption,
  options,
  onChange,
  onBlur,
  isRequired = false,
  hasError = false,
  errorMessage = "",
  ...props
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholderOption?: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: FormSelectProps["onChange"];
  onBlur: FormSelectProps["onBlur"];
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  [key: string]: any;
}) {
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <FormSelect
        id={id}
        data-testid={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      >
        {placeholderOption && (
          <FormSelectOption value="" label={placeholderOption} isPlaceholder />
        )}
        {options.map((option, index) => (
          <FormSelectOption
            key={index}
            value={option.value}
            label={option.label}
          />
        ))}
      </FormSelect>
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
