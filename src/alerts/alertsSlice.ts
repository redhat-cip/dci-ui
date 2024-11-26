import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";
import { DCIError, IAlert } from "types";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";

interface AlertsState {
  [x: string]: IAlert;
}

const initialState: AlertsState = {};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<IAlert>) => {
      state[action.payload.id] = action.payload;
    },
    hideAlert: (state, action: PayloadAction<IAlert>) => {
      delete state[action.payload.id];
    },
    hideAllAlerts: (state) => {
      return initialState;
    },
  },
});

export const { showAlert, hideAlert, hideAllAlerts } = alertsSlice.actions;

export const selectAlerts = (state: RootState) => state.alerts;

function showAndHideAfter10s(
  title = "",
  message = "",
  type: "success" | "danger" | "warning" = "success",
) {
  return (dispatch: AppDispatch) => {
    const alert: IAlert = {
      id: `${Date.now().toString()}:${title}`,
      title,
      message,
      type,
    };
    dispatch(showAlert(alert));
    setTimeout(() => dispatch(hideAlert(alert)), 10000);
  };
}

export function showSuccess(title: string, message: string = "") {
  return showAndHideAfter10s(title, message, "success");
}

export function showError(title: string, message: string = "") {
  return showAndHideAfter10s(title, message, "danger");
}

function getTitleAndMessageFromAxiosError(axiosError: AxiosError<DCIError>) {
  const data = axiosError?.response?.data;
  if (isEmpty(data))
    return {
      title: "Unknown error",
      message:
        "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?",
    };
  const titleAndMessage = {
    title: data.message || "Request malformed",
    message: "",
  };
  const payload = data.payload;
  if (isEmpty(payload)) return titleAndMessage;
  if (Array.isArray(payload.errors)) {
    titleAndMessage.message = payload.errors.join("\n");
    return titleAndMessage;
  }
  const error = payload.error || payload.errors || {};
  titleAndMessage.message = (Object.keys(error) as Array<keyof typeof error>)
    .map((k) => `${k}: ${error[k]}`)
    .join("\n");
  return titleAndMessage;
}

export function showAPIError(error: AxiosError<DCIError>) {
  const { title, message } = getTitleAndMessageFromAxiosError(error);
  return showAndHideAfter10s(title, message, "danger");
}

export default alertsSlice.reducer;
