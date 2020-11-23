import { IAlert } from "types";

export const SHOW_ALERT = "SHOW_ALERT";
export const HIDE_ALERT = "HIDE_ALERT";

interface IShowAlertAction {
  type: typeof SHOW_ALERT;
  alert: IAlert;
}

interface IHideAlertAction {
  type: typeof HIDE_ALERT;
  alert: IAlert;
}

export type AlertsActionTypes = IShowAlertAction | IHideAlertAction;

export interface AlertsState {
  [x: string]: IAlert;
}
