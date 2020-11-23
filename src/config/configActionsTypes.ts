import { IConfig } from "types";

export const SET_CONFIG = "SET_CONFIG";

interface ISetConfig {
  type: typeof SET_CONFIG;
  config: IConfig;
}

export type IConfigActionTypes = ISetConfig;
