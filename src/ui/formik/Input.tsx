import { useField, useFormikContext } from "formik";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextInputProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

type InputProps = {
  label?: string;
  id: string;
  name: string;
} & TextInputProps;

export default function Input({ label, id, name, ...props }: InputProps) {
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup label={label} isRequired={props.isRequired} fieldId={id}>
      <TextInput
        id={id}
        {...field}
        {...props}
        onChange={(event, value) => {
          if (typeof props.onChange === "undefined") {
            setFieldValue(name, value);
          } else {
            props.onChange(event, value);
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
