import { act, waitFor } from "@testing-library/react";
import { render } from "utils/test-utils";
import CreateUserModal from "./CreateUserModal";

test("test create user form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const { user, getByRole, getByTestId } = render(
    <CreateUserModal onSubmit={mockOnSubmit}>
      {(openModal) => <button onClick={openModal}>Create a new user</button>}
    </CreateUserModal>,
  );

  const showModal = getByRole("button", { name: /Create a new user/i });
  user.click(showModal);

  await waitFor(() => {
    expect(getByRole("textbox", { name: "Login" })).toBeInTheDocument();
  });

  const login = getByRole("textbox", { name: /Login/i });
  await act(async () => {
    await user.type(login, "test");
  });

  const fullname = getByRole("textbox", { name: /Full name/i });
  await user.type(fullname, "Test User");

  const email = getByRole("textbox", { name: /Email/i });
  await user.type(email, "test@example.org");

  // reason type="password" don't have a role: https://github.com/w3c/aria/issues/935
  const password = getByTestId("user-form-password");
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password");

  user.click(getByRole("button", { name: "Create" }));

  await waitFor(() => {
    expect(login).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      fullname: "Test User",
      email: "test@example.org",
      password: "password",
    });
  });
});
