import {
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import type { FieldError } from "react-hook-form";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export default function FormErrorMessage({
  error,
  ...props
}: {
  error?: FieldError;
  [key: string]: any;
}) {
  if (!error) return null;

  return (
    <FormHelperText {...props}>
      <HelperText>
        <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
          {error.message}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  );
}
