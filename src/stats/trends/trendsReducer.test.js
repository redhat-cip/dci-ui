import reducer from "./trendsReducer";
import * as types from "./trendsActionsTypes";

it("setTrends", () => {
  const newState = reducer(undefined, {
    type: types.SET_TRENDS,
    trends: {
      t1: [
        [1527552000, 3, 32],
        [1531699200, 3, 0],
        [1508630400, 6, 5],
      ],
    },
  });
  expect(newState).toEqual({
    t1: [
      [1527552000, 3, 32],
      [1531699200, 3, 0],
      [1508630400, 6, 5],
    ],
  });
});
