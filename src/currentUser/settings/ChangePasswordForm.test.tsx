import { render, fireEvent, waitFor } from "@testing-library/react";
import ChangePasswordForm from "./ChangePasswordForm";
import { ICurrentUser } from "types";

test("test change password form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const { container, getByRole, getByTestId } = render(
    <ChangePasswordForm
      onSubmit={mockOnSubmit}
      currentUser={{ id: "cu1", etag: "e1" } as ICurrentUser}
    />
  );
  const change_password_form = container.querySelector("#change_password_form");
  expect(change_password_form).not.toBe(null);

  const current_password = getByTestId(
    "change_password_form__current_password"
  ) as HTMLInputElement;
  expect(current_password.type).toBe("password");
  fireEvent.change(current_password, {
    target: {
      value: "current password",
    },
  });

  const new_password = getByTestId(
    "change_password_form__new_password"
  ) as HTMLInputElement;
  expect(new_password.type).toBe("password");
  fireEvent.change(new_password, {
    target: {
      value: "new password",
    },
  });

  const createButton = getByRole("button", { name: /Change your password/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "cu1",
      etag: "e1",
      current_password: "current password",
      new_password: "new password",
    });
  });
});
