import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateRemoteciModal from "./CreateRemoteciModal";
import { ITeam } from "types";

test("test create remoteci form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const teams = [
    { id: "t1", name: "team 1" },
    { id: "t2", name: "team 2" },
  ] as ITeam[];
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <CreateRemoteciModal onSubmit={mockOnSubmit} teams={teams} />
  );

  const showModal = getByRole("button", { name: /Create a new remoteci/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#create_remoteci_modal")
    ).toBeInTheDocument();
  });

  const remoteci_form = baseElement.querySelector("#remoteci_form");
  expect(remoteci_form).toBeInTheDocument();

  const name = getByTestId("remoteci_form__name");
  fireEvent.change(name, {
    target: {
      value: "Remoteci 1",
    },
  });

  const teams_select = getByPlaceholderText("Team Owner") as HTMLSelectElement;
  fireEvent.change(teams_select, {
    target: { value: teams[1].name },
  });
  const option_2 = getByTestId(
    "remoteci_form__team_id[1]"
  ) as HTMLButtonElement;
  fireEvent.click(option_2);

  const createButton = getByRole("button", { name: /Create/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(remoteci_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "Remoteci 1",
      team_id: "t2",
    });
  });
});
