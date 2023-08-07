import {
  Button,
  ListVariant,
  LoginFooterItem,
  LoginPage,
} from "@patternfly/react-core";
import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import Logo from "logo.min.svg";
import useSwitch from "hooks/useSwitch";
import { BackgroundImage } from "ui";

export default function DCILoginPage() {
  const { isOn: seeSSOForm, toggle } = useSwitch(true);
  const loginSubtitle = seeSSOForm
    ? "To continue on DCI you need to log in using your Red Hat account. Click on the Log in button to be redirected to the Red Hat login page."
    : "To continue on DCI you need to log in. For a better experience we encourage you to use your Red Hat account.";

  return (
    <LoginPage
      footerListVariants={ListVariant.inline}
      brandImgSrc={Logo}
      brandImgAlt="DCI logo"
      footerListItems={
        <LoginFooterItem
          href="https://doc.distributed-ci.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </LoginFooterItem>
      }
      textContent="DCI or Distributed CI is a continuous integration project that aims to bring partners inside Red Hat CI framework by running CI on dedicated lab environments that are running in their data centers with their configurations and their applications."
      loginTitle="Log in to your account"
      loginSubtitle={loginSubtitle}
    >
      <BackgroundImage />
      <div>
        {seeSSOForm ? <SSOForm /> : <LoginForm />}
        <div>
          <Button
            variant="link"
            className="pf-v5-u-p-0 pf-v5-u-mt-xl"
            onClick={toggle}
          >
            toggle login form
          </Button>
        </div>
      </div>
    </LoginPage>
  );
}
