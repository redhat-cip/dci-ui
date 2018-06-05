// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import objectValues from "object.values";

import { connectWithStore } from "store";
import { Alert } from "patternfly-react";
import { hideAlert } from "./AlertsActions";

const Alerts = styled.div`
  position: absolute;
  z-index: 100;
  right: 20px;
`;

export function AlertsContainer({ alerts, hide }) {
  return (
    <Alerts>
      {objectValues(alerts).map((alert, i) => (
        <Alert key={i} type={alert.type} onDismiss={() => hide(alert)}>
          {alert.message}
        </Alert>
      ))}
    </Alerts>
  );
}

AlertsContainer.propTypes = {
  alerts: PropTypes.object,
  hide: PropTypes.func
};

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

export default connectWithStore(
  AlertsContainer,
  mapStateToProps,
  mapDispatchToProps
);
