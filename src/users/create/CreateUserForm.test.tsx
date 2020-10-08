import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateUserForm from "./CreateUserForm";

test("test create user form submit the correct value", async () => {
  const mockOnSubmit = jest.fn();
  const { container, getByRole, getByTestId } = render(
    <CreateUserForm onSubmit={mockOnSubmit} />
  );
  const taskForm = container.querySelector("#create_user_form");
  expect(taskForm).not.toBe(null);

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

  const email = getByTestId("create_user_form__email");
  fireEvent.change(email, {
    target: {
      value: "test@example.org",
    },
  });

  const password = getByTestId(
    "create_user_form__password"
  ) as HTMLInputElement;
  fireEvent.change(password, {
    target: {
      value: "password",
    },
  });
  expect(password.type).toBe("password");

  const createButton = getByRole("button", { name: /Create a user/i });
  fireEvent.click(createButton);

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
