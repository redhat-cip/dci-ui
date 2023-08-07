import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateUserForm from "./CreateUserForm";

test("test create user form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const { container, getByTestId } = render(
    <CreateUserForm onSubmit={mockOnSubmit} />,
  );
  const create_user_form = container.querySelector("#create_user_form");
  expect(create_user_form).not.toBe(null);

  const name = getByTestId("create_user_form__name");
  fireEvent.change(name, {
    target: {
      value: "test",
    },
  });

  const fullname = getByTestId("create_user_form__fullname");
  fireEvent.change(fullname, {
    target: {
      value: "Test User",
    },
  });

  const email = getByTestId("create_user_form__email") as HTMLInputElement;
  expect(email.type).toBe("email");
  fireEvent.change(email, {
    target: {
      value: "test@example.org",
    },
  });

  const password = getByTestId(
    "create_user_form__password",
  ) as HTMLInputElement;
  fireEvent.change(password, {
    target: {
      value: "password",
    },
  });
  expect(password.type).toBe("password");

  fireEvent.submit(name);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      fullname: "Test User",
      email: "test@example.org",
      password: "password",
    });
  });
});
