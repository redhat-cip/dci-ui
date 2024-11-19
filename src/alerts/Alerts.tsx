import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { hideAlert } from "./alertsSlice";
import { RootState, useAppDispatch } from "store";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

export default function Alerts() {
  const alerts = useSelector((state: RootState) => state.alerts);
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
