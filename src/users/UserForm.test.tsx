import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import UserForm from "./UserForm";
import { IUser } from "types";
import { vi } from "vitest";

test("test UserForm with existing user", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByTestId } = render(
    <div>
      <UserForm
        id="edit-user-form"
        user={
          {
            id: "u1",
            name: "user 1",
            fullname: "my full name",
            email: "u1@example.org",
            password: "",
          } as IUser
        }
        onSubmit={mockOnSubmit}
      />
      <button type="submit" form="edit-user-form">
        Edit
      </button>
    </div>,
  );

  const login = getByRole("textbox", { name: /Login/i });
  expect(login).toHaveValue("user 1");
  await user.clear(login);
  await user.type(login, "user");

  const fullname = getByRole("textbox", { name: /Full name/i });
  expect(fullname).toHaveValue("my full name");
  await user.clear(fullname);
  await user.type(fullname, "Full name");

  const email = getByRole("textbox", { name: /Email/i });
  expect(email).toHaveValue("u1@example.org");
  await user.clear(email);
  await user.type(email, "user@example.org");

  // reason type="password" don't have a role: https://github.com/w3c/aria/issues/935
  const password = getByTestId("user-form-password");
  expect(password).toHaveValue("");
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password");

  user.click(getByRole("button", { name: "Edit" }));

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "u1",
      name: "user",
      fullname: "Full name",
      email: "user@example.org",
      password: "password",
    });
  });
});
