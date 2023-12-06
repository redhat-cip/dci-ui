import { waitFor } from "@testing-library/react";
import { ITeam } from "types";
import { render } from "utils/test-utils";
import TeamForm from "./TeamForm";

test("test create team form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const { user, getByRole, getByTestId } = render(
    <div>
      <TeamForm id="create-user-form" onSubmit={mockOnSubmit} />
      <button type="submit" form="create-user-form">
        Create
      </button>
    </div>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  expect(name).toHaveValue("");
  await user.clear(name);
  await user.type(name, "RHEL");

  expect(getByTestId("team-form-state")).toHaveValue("active");
  await user.selectOptions(getByTestId("team-form-state"), "inactive");

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
  const mockOnSubmit = jest.fn();

  const { user, getByRole, getByTestId } = render(
    <div>
      <TeamForm
        id="edit-user-form"
        team={
          {
            id: "t1",
            name: "team 1",
            state: "inactive",
            external: false,
            has_pre_release_access: true,
          } as unknown as ITeam
        }
        onSubmit={mockOnSubmit}
      />
      <button type="submit" form="edit-user-form">
        Edit
      </button>
    </div>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  expect(name).toHaveValue("team 1");

  const partner = getByRole("checkbox", { name: "Partner" });
  expect(partner).not.toBeChecked();
  user.click(partner);

  const has_pre_release_access = getByRole("checkbox", {
    name: "Pre release access",
  });
  expect(has_pre_release_access).toBeChecked();
  user.click(has_pre_release_access);

  expect(getByTestId("team-form-state")).toHaveValue("inactive");
  await user.selectOptions(getByTestId("team-form-state"), "active");

  user.click(getByRole("button", { name: "Edit" }));

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "t1",
      name: "team 1",
      state: "active",
      external: true,
      has_pre_release_access: false,
    });
  });
});
