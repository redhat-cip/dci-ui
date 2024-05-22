import { useField, useFormikContext } from "formik";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import TypeheadSelect from "ui/form/TypeheadSelect";

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
}

export default function SelectWithTypeahead({
  id,
  label,
  placeholder,
  name,
  options,
  isRequired = false,
}: SelectWithTypeaheadProps) {
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <TypeheadSelect
        id={id}
        placeholder={placeholder}
        onClear={() => setFieldValue(name, null)}
        onSelect={(item) => {
          if (item) {
            setFieldValue(name, item.value);
          }
        }}
        item={options.find((option) => option.value === field.value)}
        items={options}
      />
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
