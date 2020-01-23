import styled from "styled-components";
import {
  global_danger_color_100,
  global_success_color_100,
  global_warning_color_100
} from "@patternfly/react-tokens";
import { Label } from "@patternfly/react-core";

const RegressionLabel = styled(Label)`
  background-color: ${global_danger_color_100.value};
  &:hover {
    background-color: ${global_danger_color_100.value};
  }
`;

const SuccessLabel = styled(Label)`
  background-color: ${global_success_color_100.value};
  &:hover {
    background-color: ${global_success_color_100.value};
  }
`;

const ErrorLabel = styled(Label)`
  background-color: ${global_danger_color_100.value};
  &:hover {
    background-color: ${global_danger_color_100.value};
  }
`;

const FailureLabel = styled(Label)`
  background-color: ${global_danger_color_100.value};
  &:hover {
    background-color: ${global_danger_color_100.value};
  }
`;

const WarningLabel = styled(Label)`
  background-color: ${global_warning_color_100.value};
  &:hover {
    background-color: ${global_warning_color_100.value};
  }
`;

export default {
  Default: Label,
  Success: SuccessLabel,
  Error: ErrorLabel,
  Failure: FailureLabel,
  Warning: WarningLabel,
  Regression: RegressionLabel
};
