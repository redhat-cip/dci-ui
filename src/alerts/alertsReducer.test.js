import reducer from "./alertsReducer";
import * as types from "./alertsActionsTypes";

it("alertsReducer initial state", () => {
  expect(reducer(undefined, {})).toEqual({});
});

it("SHOW_ALERT", () => {
  expect(
    reducer(undefined, {
      type: types.SHOW_ALERT,
      alert: {
        id: "a1",
      },
    })
  ).toEqual({
    a1: {
      id: "a1",
    },
  });
});

it("SHOW_ALERT keep existing alerts", () => {
  expect(
    reducer(
      {
        a1: {
          id: "a1",
        },
      },
      {
        type: types.SHOW_ALERT,
        alert: {
          id: "a2",
        },
      }
    )
  ).toEqual({
    a1: {
      id: "a1",
    },
    a2: {
      id: "a2",
    },
  });
});

it("HIDE_ALERT", () => {
  expect(
    reducer(
      {
        a1: {
          id: "a1",
        },
        a2: {
          id: "a2",
        },
      },
      {
        type: types.HIDE_ALERT,
        alert: {
          id: "a1",
        },
      }
    )
  ).toEqual({
    a2: {
      id: "a2",
    },
  });
});
