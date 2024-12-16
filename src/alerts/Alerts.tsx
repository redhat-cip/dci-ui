import { isEmpty } from "lodash";
import { hideAlert, selectAlerts } from "./alertsSlice";
import { useAppDispatch, useAppSelector } from "store";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

export default function Alerts() {
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  const alertsArray = Object.values(alerts);
  if (isEmpty(alertsArray)) return null;
  return (
    <div
      style={{
        width: "80%",
        maxWidth: "1024px",
        zIndex: 1000,
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent",
      }}
      role="alert"
    >
      {alertsArray.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.type}
          title={alert.title}
          className="pf-v6-u-mt-sm"
          actionClose={
            <AlertActionCloseButton
              onClose={() => dispatch(hideAlert(alert))}
            />
          }
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}
