import React from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";

type InputProps = {
  id: string;
  name: string;
  label: string;
  isRequired?: boolean;
  register: (ref: HTMLInputElement) => void;
};

const Input = ({
  id,
  name,
  label,
  isRequired = true,
  register,
  ...rest
}: InputProps) => {
  console.log(rest)
  return <FormGroup label={label}  fieldId={id}>
  <TextInput
    
    id={id}
    name={name}
    ref={register}
    {...rest}
  />
</FormGroup>
}

export default Input;
