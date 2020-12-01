import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateTeamModal from "./CreateTeamModal";

test("test create team form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <CreateTeamModal onSubmit={mockOnSubmit} />
  );

  const showModal = getByRole("button", { name: /Create a new team/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(baseElement.querySelector("#create_team_modal")).toBeInTheDocument();
  });

  const team_form = baseElement.querySelector("#team_form");
  expect(team_form).toBeInTheDocument();

  const name = getByTestId("team_form__name");
  fireEvent.change(name, {
    target: {
      value: "RHEL",
    },
  });

  const state = getByPlaceholderText("State") as HTMLSelectElement;
  fireEvent.change(state, {
    target: { value: "inactive" },
  });

  const external = getByTestId("team_form__external");
  fireEvent.click(external);

  const createButton = getByRole("button", { name: /Create/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "RHEL",
      state: "inactive",
      external: true,
    });
  });
});
