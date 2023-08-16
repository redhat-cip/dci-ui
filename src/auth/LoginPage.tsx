import { Button } from "@patternfly/react-core";
import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import Logo from "./logo.black.min.svg";
import useSwitch from "hooks/useSwitch";
import { BackgroundImage } from "ui";

export default function DCILoginPage() {
  const { isOn: seeSSOForm, toggle } = useSwitch(true);
  return (
    <>
      <BackgroundImage />
      <div className="pf-v5-c-login">
        <div className="pf-v5-c-login__container">
          <header
            className="pf-v5-c-login__header"
            style={{ marginTop: "3rem" }}
          >
            <img
              className="pf-v5-c-brand"
              src={Logo}
              alt="DCI Logo"
              style={{ marginBottom: "2rem" }}
            />
          </header>
          <main className="pf-v5-c-login__main">
            <header className="pf-v5-c-login__main-header">
              <h1 className="pf-v5-c-title pf-m-3xl">Log in to your account</h1>

              {seeSSOForm ? (
                <p className="pf-v5-c-login__main-header-desc">
                  To continue on DCI you need to log in using your Red Hat
                  account.
                  <br />
                  Click on the Log in button to be redirected to the Red Hat
                  login page.
                </p>
              ) : (
                <p className="pf-v5-c-login__main-header-desc">
                  To continue on DCI you need to log in. For a better experience
                  we encourage you to use your Red Hat account.
                </p>
              )}
            </header>
            <div className="pf-v5-c-login__main-body">
              {seeSSOForm ? (
                <div className="pf-v5-u-pt-lg">
                  <SSOForm />
                </div>
              ) : (
                <LoginForm />
              )}
            </div>
            <footer className="pf-v5-c-login__main-footer">
              <div className="pf-v5-c-login__main-footer-band">
                <p className="pf-v5-c-login__main-footer-band-item">
                  <Button variant="link" onClick={toggle}>
                    toggle login form
                  </Button>
                </p>
              </div>
            </footer>
          </main>
          <footer className="pf-v5-c-login__footer">
            <p style={{ color: "black", marginBottom: "2rem" }}>
              Distributed CI (DCI) is an advanced continuous integration
              solution that aims to bring partners inside Red Hat CI framework
              by running CI on dedicated lab environments that are running in
              their data centers with their configurations and their
              applications.
            </p>
            <a
              href="https://doc.distributed-ci.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              See the documentation
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
