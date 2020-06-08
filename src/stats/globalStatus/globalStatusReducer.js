import { sortBy } from "lodash";
import * as types from "./globalStatusActionsTypes";

export function orderGlobalStatus(stats) {
  return sortBy(stats, (s) => s.topic_name);
}

export default function (state = [], action) {
  switch (action.type) {
    case types.SET_GLOBAL_STATUS:
      const globalStatus = orderGlobalStatus(action.globalStatus);
      return [...globalStatus];
    default:
      return state;
  }
}
