import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextArea,
  TextAreaProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useField, useFormikContext } from "formik";

type DCITextAreaProps = {
  label?: string;
  id: string;
  name: string;
} & TextAreaProps;

export default function DCITextArea({
  label,
  id,
  name,
  ...props
}: DCITextAreaProps) {
  const [field] = useField(name);
  const { touched, errors, setFieldValue } = useFormikContext<{
    [k: string]: string;
  }>();
  const hasError = errors[name] && touched[name];
  return (
    <FormGroup label={label} isRequired={props.isRequired} fieldId={id}>
      <TextArea
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
