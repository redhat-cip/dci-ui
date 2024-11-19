import {
  Button,
  ListItem,
  ListVariant,
  LoginFooterItem,
  LoginPage,
} from "@patternfly/react-core";
import Logo from "logo.black.svg";
import { BackgroundImage } from "ui";
import { manager, SSOUrl } from "./sso";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "store";
import { showError } from "alerts/alertsSlice";

export default function DCILoginPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  return (
    <LoginPage
      brandImgSrc={Logo}
      brandImgAlt="DCI logo"
      footerListVariants={ListVariant.inline}
      footerListItems={
        <ListItem>
          <LoginFooterItem
            href="https://doc.distributed-ci.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            See the documentation
          </LoginFooterItem>
        </ListItem>
      }
      textContent="Distributed CI is an advanced continuous integration solution that aims to bring partners inside Red Hat CI framework by running CI on dedicated lab environments that are running in their data centers with their configurations and their applications."
      loginTitle="Log in to your account"
      loginSubtitle="To continue on DCI you need to log in using your Red Hat account.  Click on the Log in button to be redirected to the Red Hat login page."
    >
      <BackgroundImage />
      <Button
        variant="danger"
        onClick={() => {
          manager.signinRedirect({ state: location.state }).catch(() => {
            dispatch(
              showError(
                `We are sorry! We can't connect to ${SSOUrl}. Can you try later ?`,
              ),
            );
          });
        }}
      >
        Log in using Red Hat SSO
      </Button>
    </LoginPage>
  );
}
