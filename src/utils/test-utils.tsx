import React, { PropsWithChildren } from "react";
import { render as renderTL } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore } from "../store";
import type { RenderOptions } from "@testing-library/react";
import type { AppStore, RootState } from "../store";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "auth/authContext";
import { setBasicToken } from "services/localStorage";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    setBasicToken("dXNlcg==");
    return (
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    );
  }
  return {
    user: userEvent.setup(),
    store,
    ...renderTL(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function render(ui: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...renderTL(ui),
  };
}
