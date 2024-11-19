import { render, fireEvent, waitFor, within } from "@testing-library/react";
import CreateFeederForm from "./CreateFeederForm";
import { vi } from "vitest";
import { teams } from "__tests__/data";

test("test create feeder form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();

  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <CreateFeederForm teams={teams} onSubmit={mockOnSubmit} />,
  );
  const create_feeder_form = container.querySelector("#create_feeder_form");
  expect(create_feeder_form).not.toBe(null);

  const name = getByTestId("create_feeder_form__name");
  fireEvent.change(name, {
    target: {
      value: "test",
    },
  });

  const teams_select = getByPlaceholderText(
    "Select a team",
  ) as HTMLSelectElement;
  fireEvent.click(teams_select);
  const option_2 = getByTestId("create_feeder_form__team_id[1]");
  await waitFor(() => expect(option_2).toBeInTheDocument());
  const team2 = within(option_2).getByRole("option") as HTMLButtonElement;
  fireEvent.click(team2);

  const createButton = getByRole("button", { name: /Create a feeder/i });
  await waitFor(() => expect(createButton).not.toBeDisabled());
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      team_id: teams[1].id,
    });
  });
});
