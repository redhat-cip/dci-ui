import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import objectValues from "object.values";

import { Alert } from "patternfly-react";
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
      {objectValues(alerts).map((alert, i) => (
        <Alert key={i} type={alert.type} onDismiss={() => hide(alert)}>
          {alert.message.split("\n").map((item, key) => (
            <span key={key}>
              {item}
              <br />
            </span>
          ))}
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
