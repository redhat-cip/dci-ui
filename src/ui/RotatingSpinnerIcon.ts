import { SpinnerIcon } from "@patternfly/react-icons";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RotatingSpinnerIcon = styled(SpinnerIcon)`
  animation: ${rotate} normal 2s infinite;
`;

export default RotatingSpinnerIcon;
