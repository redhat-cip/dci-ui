import React, { PropsWithChildren } from "react";
import { render as renderTL } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore } from "../store";
import type { RenderOptions } from "@testing-library/react";
import type { AppStore, RootState } from "../store";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { currentUser } from "__tests__/data";
import { ThemeProvider } from "ui/Theme/themeContext";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = { auth: { currentUser } },
    store = setupStore(preloadedState),
    initialEntries = ["/"],
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <ThemeProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
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
