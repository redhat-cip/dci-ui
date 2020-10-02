import React from "react";
import { connect } from "react-redux";
import { values } from "lodash";
import styled from "styled-components";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";
import { hideAlert } from "./alertsActions";

const AlertsContainer = styled.div`
  position: fixed;
  z-index: 600;
  padding: 1em;
  width: 100%;

  @media only screen and (min-width: 960px) {
    width: 75%;
    right: 1em;
  }
`;

export function Alerts({ alerts, hide }) {
  return (
    <AlertsContainer>
      <>
        {values(alerts).map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type}
            title={alert.title}
            actionClose={<AlertActionCloseButton onClose={() => hide(alert)} />}
          >
            {alert.message
              ? alert.message.split("\n").map((m, i) => <p key={i}>{m}</p>)
              : null}
          </Alert>
        ))}
      </>
    </AlertsContainer>
  );
}

function mapStateToProps(state) {
  return {
    alerts: state.alerts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hide: (alert) => {
      dispatch(hideAlert(alert));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
