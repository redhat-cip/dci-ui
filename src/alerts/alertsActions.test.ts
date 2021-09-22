import { IAlert } from "types";
import * as actions from "./alertsActions";
import * as types from "./alertsActionsTypes";

test("showAlert", () => {
  const alert: IAlert = {
    id: "a1",
    type: "success",
    title: "",
    message: "",
  };
  const expectedAction = {
    type: types.SHOW_ALERT,
    alert,
  };
  expect(actions.showAlert(alert)).toEqual(expectedAction);
});

test("hideAlert", () => {
  const alert: IAlert = {
    id: "a1",
    type: "success",
    title: "",
    message: "",
  };
  const expectedAction = {
    type: types.HIDE_ALERT,
    alert,
  };
  expect(actions.hideAlert(alert)).toEqual(expectedAction);
});
