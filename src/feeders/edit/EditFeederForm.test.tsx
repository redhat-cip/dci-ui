import { render, fireEvent, waitFor, within } from "@testing-library/react";
import EditFeederForm from "./EditFeederForm";
import { vi } from "vitest";
import { teams, feeder } from "__tests__/data";

test("test edit feeder form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditFeederForm feeder={feeder} teams={teams} onSubmit={mockOnSubmit} />,
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
    "Select a team",
  ) as HTMLSelectElement;
  fireEvent.click(teams_select);
  const option_1 = getByTestId("edit_feeder_form__team_id[0]");
  await waitFor(() => expect(option_1).toBeInTheDocument());
  const team1 = within(option_1).getByRole("option") as HTMLButtonElement;
  fireEvent.click(team1);

  const editButton = getByRole("button", { name: /Edit/i });
  await waitFor(() => expect(editButton).not.toBeDisabled());
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...feeder,
      name: "updated",
      team_id: teams[0].id,
    });
  });
});
