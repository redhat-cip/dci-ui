import { act } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { ThemeProvider } from "ui/Theme/themeContext";

test("renders without crashing", async () => {
  await act(async () => {
    render(
      <ThemeProvider>
        <Provider store={store}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>,
    );
  });
});
