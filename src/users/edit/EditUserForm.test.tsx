import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateUserForm from "./EditUserForm";
import { IUser } from "types";

test("test create user form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const user = {
    id: "u1",
    name: "user 1",
    fullname: "",
    email: "u1@example.org",
    password: "",
  } as IUser;
  const { container, getByRole, getByTestId } = render(
    <CreateUserForm user={user} onSubmit={mockOnSubmit} />
  );
  const create_user_form = container.querySelector("#create_user_form");
  expect(create_user_form).not.toBe(null);

  const fullname = getByTestId("create_user_form__fullname");
  fireEvent.change(fullname, {
    target: {
      value: "User 1",
    },
  });

  const email = getByTestId("create_user_form__email") as HTMLInputElement;
  expect(email.type).toBe("email");
  fireEvent.change(email, {
    target: {
      value: "user1@example.org",
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

  const createButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "u1",
      name: "user 1",
      fullname: "User 1",
      email: "user1@example.org",
      password: "password",
    });
  });
});
