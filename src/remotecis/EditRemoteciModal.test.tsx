import { render, fireEvent, waitFor, within } from "@testing-library/react";
import EditRemoteciModal from "./EditRemoteciModal";
import { IRemoteci, ITeam } from "types";

test("test edit remoteci form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const remoteci = {
    id: "r1",
    etag: "e1",
    name: "Remoteci 1",
    team_id: "t2",
    from_now: "",
  } as unknown as IRemoteci;
  const teams = [
    { id: "t1", name: "team 1" },
    { id: "t2", name: "team 2" },
  ] as ITeam[];
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditRemoteciModal
      teams={teams}
      remoteci={remoteci}
      onSubmit={mockOnSubmit}
    />,
  );

  const showModal = getByRole("button", { name: /Edit Remoteci 1/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#edit_remoteci_modal"),
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
  fireEvent.click(teams_select);
  const option1 = getByTestId("remoteci_form__team_id[0]");
  await waitFor(() => expect(option1).toBeInTheDocument());
  const team1 = within(option1).getByRole("option") as HTMLButtonElement;
  fireEvent.click(team1);

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(remoteci_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "r1",
      etag: "e1",
      name: "Edited remoteci 1",
      team_id: "t1",
    });
  });
});
