import { useState } from "react";
import { useField, useFormikContext } from "formik";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import {
  Select,
  SelectVariant,
  SelectOption,
} from "@patternfly/react-core/deprecated";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

type SelectOptionType = {
  label: string;
  value: string;
};

interface SelectWithTypeaheadProps {
  id: string;
  label?: string;
  placeholder?: string;
  name: string;
  options: SelectOptionType[];
  isRequired?: boolean;
  [x: string]: any;
}

export default function SelectWithTypeahead({
  id,
  label,
  placeholder,
  name,
  options,
  isRequired = false,
  ...props
}: SelectWithTypeaheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <Select
        {...field}
        {...props}
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={placeholder}
        onToggle={(_event, val) => setIsOpen(val)}
        onSelect={(event, selection) => {
          const s = selection as SelectOptionType;
          setIsOpen(false);
          setFieldValue(name, s.value);
        }}
        onClear={() => setFieldValue(name, null)}
        selections={
          field.value ? options.find((o) => o.value === field.value)?.label : ""
        }
        isOpen={isOpen}
        aria-labelledby={id}
        placeholderText={placeholder}
        menuAppendTo="parent"
        maxHeight="220px"
      >
        {options
          .map((o) => ({ ...o, toString: () => o.label }))
          .map((option, i) => (
            <SelectOption
              key={i}
              id={`${id}[${i}]`}
              data-testid={`${id}[${i}]`}
              value={option}
            />
          ))}
      </Select>
      {hasError && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
              {errors[name]}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
}
