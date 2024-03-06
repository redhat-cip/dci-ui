import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import alertsReducer from "./alerts/alertsReducer";
import Api from "api";
import { rtkQueryErrorLogger } from "middleware";

export const rootReducer = combineReducers({
  alerts: alertsReducer,
  [Api.reducerPath]: Api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(Api.middleware).concat(rtkQueryErrorLogger),
  });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, Action>;

const store = setupStore();

export type AppDispatch = typeof store.dispatch;

export default store;
