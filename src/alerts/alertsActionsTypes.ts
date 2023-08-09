import { IAlert } from "types";

export const SHOW_ALERT = "SHOW_ALERT";
export const HIDE_ALERT = "HIDE_ALERT";
export const HIDE_ALL_ALERTS = "HIDE_ALL_ALERTS";

interface IShowAlertAction {
  type: typeof SHOW_ALERT;
  alert: IAlert;
}

interface IHideAlertAction {
  type: typeof HIDE_ALERT;
  alert: IAlert;
}

interface IHideAllAlertsAction {
  type: typeof HIDE_ALL_ALERTS;
}

export type IAlertsActionTypes =
  | IShowAlertAction
  | IHideAlertAction
  | IHideAllAlertsAction;
