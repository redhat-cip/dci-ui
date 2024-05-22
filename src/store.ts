import { combineReducers, configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./alerts/alertsSlice";
import Api from "api";
import { rtkQueryErrorLogger } from "middleware";
import { useDispatch, useSelector } from "react-redux";

export const rootReducer = combineReducers({
  alerts: alertsReducer,
  [Api.reducerPath]: Api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(Api.middleware).concat(rtkQueryErrorLogger),
  });
}

export type AppStore = ReturnType<typeof setupStore>;

const store = setupStore();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
