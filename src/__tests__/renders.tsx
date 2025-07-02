import React, { type JSX, type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { render as renderTL, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { currentUser } from "./data";
import { ThemeProvider } from "ui/Theme/themeContext";
import { setupStore, type AppStore, type RootState } from "store";

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
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
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
