import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditRemoteciModal from "./EditRemoteciModal";
import { IRemoteci, ITeam } from "types";

test("test edit remoteci form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const remoteci = ({
    id: "r1",
    name: "Remoteci 1",
    team_id: "t2",
  } as unknown) as IRemoteci;
  const teams = [
    { id: "t1", name: "team 1" },
    { id: "t2", name: "team 2" },
  ] as ITeam[];
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditRemoteciModal
      teams={teams}
      remoteci={remoteci}
      onSubmit={mockOnSubmit}
    />
  );

  const showModal = getByRole("button", { name: /Edit Remoteci 1/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#edit_remoteci_modal")
    ).toBeInTheDocument();
  });

  const remoteci_form = baseElement.querySelector("#remoteci_form");
  expect(remoteci_form).toBeInTheDocument();

  const name = getByTestId("remoteci_form__name") as HTMLInputElement;
  expect(name.value).toBe("Remoteci 1");
  fireEvent.change(name, {
    target: {
      value: "Edited remoteci 1",
    },
  });

  const teams_select = getByPlaceholderText("Team Owner") as HTMLSelectElement;
  expect(teams_select.value).toBe("team 2");
  fireEvent.change(teams_select, {
    target: { value: teams[0].name },
  });
  const option_1 = getByTestId(
    "remoteci_form__team_id[0]"
  ) as HTMLButtonElement;
  fireEvent.click(option_1);

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "r1",
      name: "Edited remoteci 1",
      team_id: "t1",
    });
  });
});
