import { getAlertFromBaseQueryError } from "./errorHelpers";

test("getAlertFromBaseQueryError 404", () => {
  expect(
    getAlertFromBaseQueryError({
      status: 404,
      data: { message: "job not found", payload: {}, status_code: 404 },
    }),
  ).toEqual({
    id: expect.any(String),
    title: "Error 404",
    type: "danger",
    message: "job not found",
  });
});

test("getAlertFromBaseQueryError FETCH_ERROR", () => {
  expect(
    getAlertFromBaseQueryError({
      status: "FETCH_ERROR",
      error: "TypeError: Failed to fetch",
    }),
  ).toEqual({
    id: expect.any(String),
    title: "Fetch error",
    type: "danger",
    message: "TypeError: Failed to fetch",
  });
});

test("getAlertFromBaseQueryError null error", () => {
  expect(getAlertFromBaseQueryError(null)).toEqual({
    id: expect.any(String),
    title: "Unknown error",
    type: "danger",
    message:
      "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?",
  });
});
