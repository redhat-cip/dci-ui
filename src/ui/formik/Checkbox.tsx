import { useField, useFormikContext } from "formik";
import {
  Checkbox,
  FormGroup,
  CheckboxProps,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

type DCICheckboxProps = {
  label?: string;
  id: string;
  name: string;
} & CheckboxProps;

export default function DCICheckbox({
  label,
  id,
  name,
  ref,
  ...props
}: DCICheckboxProps) {
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup fieldId={id}>
      <Checkbox
        id={id}
        label={label}
        {...field}
        {...props}
        isChecked={field.value}
        onChange={(event, checked) => {
          setFieldValue(name, checked);
          if (typeof props.onChange !== "undefined") {
            props.onChange(event, checked);
          }
        }}
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
