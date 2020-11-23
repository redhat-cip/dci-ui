import { IConfigState } from "types";
import * as types from "./configActionsTypes";

const initialState: IConfigState = {
  apiURL: "https://api.distributed-ci.io",
  sso: {
    url: "https://sso.redhat.com",
    realm: "redhat-external",
    clientId: "dci",
  },
};

export default function (state = initialState, action:types.IConfigActionTypes) {
  switch (action.type) {
    case types.SET_CONFIG:
      return {
        ...action.config,
      };
    default:
      return state;
  }
}
