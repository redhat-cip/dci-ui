import reducer from "./alertsReducer";
import * as types from "./alertsActionsTypes";

it("SHOW_ALERT", () => {
  expect(
    reducer(undefined, {
      type: types.SHOW_ALERT,
      alert: {
        id: "a1",
        type: "success",
        title: "",
        message: "",
      },
    })
  ).toEqual({
    a1: {
      id: "a1",
      type: "success",
      title: "",
      message: "",
    },
  });
});

it("SHOW_ALERT keep existing alerts", () => {
  expect(
    reducer(
      {
        a1: {
          id: "a1",
          type: "success",
          title: "",
          message: "",
        },
      },
      {
        type: types.SHOW_ALERT,
        alert: {
          id: "a2",
          type: "success",
          title: "",
          message: "",
        },
      }
    )
  ).toEqual({
    a1: {
      id: "a1",
      type: "success",
      title: "",
      message: "",
    },
    a2: {
      id: "a2",
      type: "success",
      title: "",
      message: "",
    },
  });
});

it("HIDE_ALERT", () => {
  expect(
    reducer(
      {
        a1: {
          id: "a1",
          type: "success",
          title: "",
          message: "",
        },
        a2: {
          id: "a2",
          type: "success",
          title: "",
          message: "",
        },
      },
      {
        type: types.HIDE_ALERT,
        alert: {
          id: "a1",
          type: "success",
          title: "",
          message: "",
        },
      }
    )
  ).toEqual({
    a2: {
      id: "a2",
      type: "success",
      title: "",
      message: "",
    },
  });
});
