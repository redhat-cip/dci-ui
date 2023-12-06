import { FormGroup, Checkbox, CheckboxProps } from "@patternfly/react-core";

export default function CheckboxGroup({
  id,
  name,
  label,
  ariaLabel,
  isChecked,
  onChange,
  ...props
}: {
  id: string;
  name: string;
  label: string;
  ariaLabel?: string;
  isChecked: boolean;
  onChange: CheckboxProps["onChange"];
  [k: string]: any;
}) {
  return (
    <FormGroup fieldId={id}>
      <Checkbox
        label={label}
        id={id}
        name={name}
        aria-label={ariaLabel || label}
        isChecked={isChecked}
        onChange={onChange}
        {...props}
      />
    </FormGroup>
  );
}
