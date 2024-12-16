import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import TeamForm from "./TeamForm";
import { vi } from "vitest";
import { teams } from "__tests__/data";

test("test create team form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();

  const { user, getByRole } = render(
    <div>
      <TeamForm id="create-team-form" onSubmit={mockOnSubmit} />
      <button type="submit" form="create-team-form">
        Create
      </button>
    </div>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  expect(name).toHaveValue("");
  await user.clear(name);
  await user.type(name, "RHEL");

  await user.selectOptions(getByRole("combobox"), "inactive");

  const partner = getByRole("checkbox", { name: "Partner" });
  expect(partner).toBeChecked();
  user.click(partner);

  const has_pre_release_access = getByRole("checkbox", {
    name: "Pre release access",
  });
  expect(has_pre_release_access).not.toBeChecked();
  user.click(has_pre_release_access);

  user.click(getByRole("button", { name: "Create" }));

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "RHEL",
      state: "inactive",
      external: false,
      has_pre_release_access: true,
    });
  });
});

test("test edit team form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();

  const { user, getByRole } = render(
    <div>
      <TeamForm id="edit-team-form" team={teams[0]} onSubmit={mockOnSubmit} />
      <button type="submit" form="edit-team-form">
        Edit
      </button>
    </div>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  expect(name).toHaveValue(teams[0].name);

  const partner = getByRole("checkbox", { name: "Partner" });
  expect(partner).not.toBeChecked();
  user.click(partner);

  const has_pre_release_access = getByRole("checkbox", {
    name: "Pre release access",
  });
  expect(has_pre_release_access).toBeChecked();
  user.click(has_pre_release_access);

  await user.selectOptions(getByRole("combobox"), "active");

  user.click(getByRole("button", { name: "Edit" }));

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...teams[0],
      state: "active",
      external: true,
      has_pre_release_access: false,
    });
  });
});
