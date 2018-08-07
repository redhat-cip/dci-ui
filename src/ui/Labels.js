import styled from "styled-components";
import { Colors } from "../ui";
import { Label } from "patternfly-react";


const RegressionLabel = styled(Label)`
  background-color: ${Colors.purple300};
`;

export default {
  Regression: RegressionLabel
};
