import { IConfig } from "types";
import * as types from "./configActionsTypes";

export function setConfig(config: IConfig) {
  return {
    type: types.SET_CONFIG,
    config,
  };
}
