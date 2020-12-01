import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditFeederForm from "./EditFeederForm";
import { ITeam, IFeeder } from "types";

test("test edit feeder form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const teams = [
    { id: "t1", name: "team 1" },
    { id: "t2", name: "team 2" },
  ] as ITeam[];
  const feeder = { id: "f1", name: "feeder", team_id: "t2" } as IFeeder;
  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditFeederForm feeder={feeder} teams={teams} onSubmit={mockOnSubmit} />
  );
  const edit_feeder_form = container.querySelector("#edit_feeder_form");
  expect(edit_feeder_form).not.toBe(null);

  const name = getByTestId("edit_feeder_form__name");
  fireEvent.change(name, {
    target: {
      value: "updated",
    },
  });

  const teams_select = getByPlaceholderText(
    "Select a team"
  ) as HTMLSelectElement;
  fireEvent.change(teams_select, {
    target: { value: teams[0].name },
  });
  const option_1 = getByTestId(
    "edit_feeder_form__team_id[0]"
  ) as HTMLButtonElement;
  fireEvent.click(option_1);

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "f1",
      name: "updated",
      team_id: "t1",
    });
  });
});
