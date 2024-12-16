import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import UserForm from "./UserForm";
import { vi } from "vitest";
import { users } from "__tests__/data";
import { Button } from "@patternfly/react-core";

test("test create UserForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByLabelText } = renderWithProviders(
    <>
      <UserForm id="create-user-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-user-form">
        Create a user
      </Button>
    </>,
  );

  const login = getByLabelText(/Login/i);
  await user.type(login, "login");

  const fullname = getByLabelText(/Full name/i);
  await user.type(fullname, "fullname");

  const email = getByLabelText(/Email/i);
  await user.type(email, "distributed-ci@redhat.com");

  const password = getByLabelText(/Password/i);
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password");

  const createButton = getByRole("button", { name: /Create a user/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "login",
      fullname: "fullname",
      email: "distributed-ci@redhat.com",
      password: "password",
    });
  });
});

test("test edit UserForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByLabelText } = renderWithProviders(
    <>
      <UserForm id="edit-user-form" user={users[0]} onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="edit-user-form">
        Edit
      </Button>
    </>,
  );
  const login = getByLabelText(/Login/i);
  await user.type(login, "2");

  const fullname = getByLabelText(/Full name/i);
  await user.clear(fullname);
  await user.type(fullname, "fullname");

  const password = getByLabelText(/Password/i);
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password2");

  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...users[0],
      name: "u12",
      fullname: "fullname",
      email: users[0].email,
      password: "password2",
    });
  });
});

test("test UserForm display error message", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByText } = renderWithProviders(
    <>
      <UserForm id="create-user-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-user-form">
        Create a user
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a user/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("User name is required")).toBeVisible();
    expect(getByText("Full name is required")).toBeVisible();
    expect(getByText("Email is required")).toBeVisible();
    expect(getByText("User password is required")).toBeVisible();
  });
});
