import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import alertsReducer from "alerts/alertsSlice";
import authReducer, { loggedOut } from "auth/authSlice";
import { api } from "api";
import { rtkQueryErrorLogger } from "middleware";
import { removeToken } from "services/localStorage";

const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

const loggedOutMiddleware = createListenerMiddleware();

loggedOutMiddleware.startListening({
  actionCreator: loggedOut,
  effect: async (_, listenerApi) => {
    removeToken();
    listenerApi.cancelActiveListeners();
  },
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(api.middleware)
        .concat(loggedOutMiddleware.middleware)
        .concat(rtkQueryErrorLogger),
  });
}

export type AppStore = ReturnType<typeof setupStore>;

const store = setupStore();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
