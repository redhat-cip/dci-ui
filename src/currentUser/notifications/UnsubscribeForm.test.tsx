import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import UnsubscribeForm from "./UnsubscribeForm";
import { IRemoteci } from "types";

test("test unsubscribe form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const remotecis = [
    { id: "r1", name: "remoteci 1" },
    { id: "r2", name: "remoteci 2" },
  ] as IRemoteci[];
  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <UnsubscribeForm remotecis={remotecis} onSubmit={mockOnSubmit} />
  );

  const unsubscribe_form = container.querySelector("#unsubscribe_form");
  expect(unsubscribe_form).toBeInTheDocument();

  const select = getByPlaceholderText(
    "Subscribed RemoteCI"
  ) as HTMLSelectElement;
  fireEvent.change(select, {
    target: { value: remotecis[1].name },
  });
  const option_2 = getByTestId(
    "unsubscribe_form__remoteci_id[1]"
  ) as HTMLButtonElement;
  fireEvent.click(option_2);

  const Unsubscribe = getByRole("button", { name: /Unsubscribe/i });
  fireEvent.click(Unsubscribe);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      remoteci_id: "r2",
    });
  });
});
