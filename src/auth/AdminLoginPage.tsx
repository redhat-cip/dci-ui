import Logo from "logo.black.svg";
import LoginForm from "./LoginForm";
import { BackgroundImage } from "ui";
import { LoginPage } from "@patternfly/react-core";

export default function AdminLoginPage() {
  return (
    <LoginPage
      brandImgSrc={Logo}
      brandImgAlt="DCI logo"
      textContent="Distributed CI is an advanced continuous integration solution that aims to bring partners inside Red Hat CI framework by running CI on dedicated lab environments that are running in their data centers with their configurations and their applications."
      loginTitle="Log in to your account"
      loginSubtitle="To continue on DCI you need to log in using your Distributed CI account. It is recommended to use your SSO account, rather than an admin account."
    >
      <BackgroundImage />
      <LoginForm />
    </LoginPage>
  );
}
