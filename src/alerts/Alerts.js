import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { Alert, Button } from "@patternfly/react-core";
import { hideAlert } from "./alertsActions";
import { TimesIcon } from "@patternfly/react-icons";

const AlertsContainer = styled.div`
  position: fixed;
  z-index: 100;
  top: 20px;
  right: 20px;
`;

export function Alerts({ alerts, hide }) {
  return (
    <AlertsContainer>
      {Object.values(alerts).map((alert, i) => (
        <Alert
          key={i}
          variant={alert.type}
          title={alert.title}
          action={
            <Button
              variant="plain"
              aria-label="close alert"
              onClick={() => hide(alert)}
            >
              <TimesIcon />
            </Button>
          }
        >
          {alert.message
            ? alert.message.split("\n").map((item, key) => (
                <span key={key}>
                  {item}
                  <br />
                </span>
              ))
            : null}
        </Alert>
      ))}
    </AlertsContainer>
  );
}

function mapStateToProps(state) {
  return {
    alerts: state.alerts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hide: alert => {
      dispatch(hideAlert(alert));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alerts);
