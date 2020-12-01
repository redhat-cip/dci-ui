import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditTeamModal from "./EditTeamModal";
import { ITeam } from "types";

test("test edit team form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const team = ({
    id: "t1",
    name: "team 1",
    state: "active",
    external: false,
  } as unknown) as ITeam;
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditTeamModal team={team} onSubmit={mockOnSubmit} />
  );

  const showModal = getByRole("button", { name: /Edit team 1/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(baseElement.querySelector("#edit_team_modal")).toBeInTheDocument();
  });

  const external = getByTestId("team_form__external");
  fireEvent.click(external);

  const state = getByPlaceholderText("State") as HTMLSelectElement;
  fireEvent.change(state, {
    target: { value: "inactive" },
  });

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "t1",
      name: "team 1",
      state: "inactive",
      external: true,
    });
  });
});
