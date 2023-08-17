import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { AuthProvider } from "auth/authContext";
import { SSOProvider } from "auth/ssoContext";
import { ThemeProvider } from "ui/Theme/themeContext";

test("renders without crashing", async () => {
  await act(async () => {
    render(
      <ThemeProvider>
        <Provider store={store}>
          <SSOProvider>
            <AuthProvider>
              <MemoryRouter>
                <App />
              </MemoryRouter>
            </AuthProvider>
          </SSOProvider>
        </Provider>
      </ThemeProvider>,
    );
  });
});
