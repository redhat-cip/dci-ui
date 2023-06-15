import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import alertsReducer from "./alerts/alertsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import productsReducer from "./products/productsReducer";
import topicsReducer from "./topics/topicsReducer";
import remotecisReducer from "./remotecis/remotecisReducer";
import feedersReducer from "./feeders/feedersReducer";
import teamsReducer from "./teams/teamsReducer";
import usersReducer from "./users/usersReducer";
import jobsReducer from "./jobs/jobsReducer";

export const rootReducer = combineReducers({
  alerts: alertsReducer,
  currentUser: currentUserReducer,
  jobs: jobsReducer,
  products: productsReducer,
  topics: topicsReducer,
  feeders: feedersReducer,
  remotecis: remotecisReducer,
  teams: teamsReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, Action>;

const store = setupStore();

export type AppDispatch = typeof store.dispatch;

export default store;
