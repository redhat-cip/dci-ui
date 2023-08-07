import { render, fireEvent, waitFor } from "@testing-library/react";
import { ITeam } from "types";
import TeamForm from "./TeamForm";

test("test create team form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const { getByTestId, getByPlaceholderText } = render(
    <TeamForm onSubmit={mockOnSubmit} />,
  );

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

  fireEvent.submit(name);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "RHEL",
      state: "inactive",
      external: false,
    });
  });
});

test("test edit team form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const team = {
    id: "t1",
    name: "team 1",
    state: "active",
    external: false,
  } as unknown as ITeam;
  const { getByTestId, getByPlaceholderText } = render(
    <TeamForm team={team} onSubmit={mockOnSubmit} />,
  );

  const external = getByTestId("team_form__external");
  fireEvent.click(external);

  const state = getByPlaceholderText("State") as HTMLSelectElement;
  fireEvent.change(state, {
    target: { value: "inactive" },
  });

  const teamName = getByTestId("team_form__name");
  fireEvent.submit(teamName);

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
