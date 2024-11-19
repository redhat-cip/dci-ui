import { Bullseye } from "@patternfly/react-core";
import { BlinkLogo } from "ui";

export default function NotAuthenticatedLoadingPage() {
  return (
    <div style={{ height: "100vh" }}>
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </div>
  );
}
