import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { Alert } from "@patternfly/react-core";
import { hideAlert } from "./alertsActions";

const Alerts = styled.div`
  position: fixed;
  z-index: 100;
  top: 20px;
  right: 20px;
`;

export function AlertsContainer({ alerts, hide }) {
  return (
    <Alerts>
      {Object.values(alerts).map((alert, i) => (
        <Alert key={i} variant={alert.type} title={alert.title}>
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
    </Alerts>
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
)(AlertsContainer);
