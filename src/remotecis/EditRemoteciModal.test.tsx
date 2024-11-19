import { render, fireEvent, waitFor, within } from "@testing-library/react";
import EditRemoteciModal from "./EditRemoteciModal";
import { vi } from "vitest";
import { teams, remotecis } from "__tests__/data";

test("test edit remoteci form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const remoteci = remotecis[0];
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditRemoteciModal
      teams={teams}
      remoteci={remoteci}
      onSubmit={mockOnSubmit}
    />,
  );

  const showModal = getByRole("button", { name: /Edit remoteci/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#edit_remoteci_modal"),
    ).toBeInTheDocument();
  });

  const remoteci_form = baseElement.querySelector("#remoteci_form");
  expect(remoteci_form).toBeInTheDocument();

  const name = getByTestId("remoteci_form__name") as HTMLInputElement;
  expect(name.value).toBe("Remoteci admin");
  fireEvent.change(name, {
    target: {
      value: "Edited remoteci 1",
    },
  });

  const teams_select = getByPlaceholderText("Team Owner") as HTMLSelectElement;
  expect(teams_select.value).toBe("Red Hat");
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
      id: remoteci.id,
      etag: remoteci.etag,
      name: "Edited remoteci 1",
      team_id: teams[0].id,
    });
  });
});
