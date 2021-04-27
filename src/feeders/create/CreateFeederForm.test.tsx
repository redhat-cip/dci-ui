import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateFeederForm from "./CreateFeederForm";
import { ITeam } from "types";

test("test create feeder form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const teams = [
    { id: "t1", name: "team 1" },
    { id: "t2", name: "team 2" },
  ] as ITeam[];
  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <CreateFeederForm teams={teams} onSubmit={mockOnSubmit} />
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
    "Select a team"
  ) as HTMLSelectElement;
  fireEvent.change(teams_select, {
    target: { value: teams[1].name },
  });
  const option_2 = getByTestId(
    "create_feeder_form__team_id[1]"
  ) as HTMLButtonElement;
  fireEvent.click(option_2);

  const createButton = getByRole("button", { name: /Create a feeder/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      team_id: "t2",
    });
  });
});
