import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IAlert } from "types";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

interface DCIAPIError {
  status: number;
  data: {
    message: string;
  };
}

function isDCIAPIError(error: unknown): error is DCIAPIError {
  return (
    isFetchBaseQueryError(error) &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data
  );
}

interface FetchError {
  status: "FETCH_ERROR";
  error: string;
}

function isFetchError(error: unknown): error is FetchError {
  return isFetchBaseQueryError(error) && error.status === "FETCH_ERROR";
}

export function getAlertFromBaseQueryError(error: unknown): IAlert {
  if (isDCIAPIError(error)) {
    return {
      id: Date.now().toString(),
      title: `Error ${error.status}`,
      type: "danger",
      message: error.data.message,
    };
  }
  if (isFetchError(error)) {
    return {
      id: Date.now().toString(),
      title: `Fetch error`,
      type: "danger",
      message: error.error,
    };
  }

  return {
    id: Date.now().toString(),
    title: "Unknown error",
    type: "danger",
    message:
      "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?",
  };
}
