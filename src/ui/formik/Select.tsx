import * as React from "react";
import { useField, useFormikContext } from "formik";
import {
  FormSelectOption,
  FormSelect,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

interface CustomSelectProps {
  id: string;
  label?: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange?: (v: string, e: React.FormEvent<HTMLSelectElement>) => void;
  [x: string]: any;
}

export default function CustomSelect({
  id,
  label,
  name,
  options,
  ...props
}: CustomSelectProps) {
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup label={label} isRequired={props.isRequired} fieldId={id}>
      <FormSelect
        {...field}
        {...props}
        id={id}
        onChange={(event, value) => {
          setFieldValue(name, value);
          if (typeof props.onChange !== "undefined") {
            props.onChange(value, event);
          }
        }}
      >
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
              {errors[name]}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
}
