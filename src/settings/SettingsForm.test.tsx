import { render, fireEvent, waitFor } from "@testing-library/react";
import SettingsForm from "./SettingsForm";
import { ICurrentUser } from "types";

test("test settings form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const { container, getByRole, getByTestId } = render(
    <SettingsForm
      onSubmit={mockOnSubmit}
      currentUser={
        {
          id: "cu1",
          etag: "e1",
          email: "old@example.org",
          fullname: "Test User",
        } as ICurrentUser
      }
    />,
  );
  const settings_form = container.querySelector("#settings_form");
  expect(settings_form).not.toBe(null);

  const email = getByTestId("settings_form__email") as HTMLInputElement;
  expect(email.type).toBe("email");
  expect(email.value).toBe("old@example.org");
  fireEvent.change(email, {
    target: {
      value: "new@example.org",
    },
  });

  const fullname = getByTestId("settings_form__fullname") as HTMLInputElement;
  expect(fullname.type).toBe("text");
  expect(fullname.value).toBe("Test User");

  const current_password = getByTestId(
    "settings_form__current_password",
  ) as HTMLInputElement;
  expect(current_password.type).toBe("password");
  expect(current_password.value).toBe("");
  fireEvent.change(current_password, {
    target: {
      value: "current password",
    },
  });

  const createButton = getByRole("button", { name: /Update your settings/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "cu1",
      etag: "e1",
      email: "new@example.org",
      fullname: "Test User",
      current_password: "current password",
    });
  });
});
