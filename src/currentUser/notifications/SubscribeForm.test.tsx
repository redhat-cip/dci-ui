import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SubscribeForm from "./SubscribeForm";
import { IRemoteci } from "types";

test("test subscribe form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const remotecis = [
    { id: "r1", name: "remoteci 1" },
    { id: "r2", name: "remoteci 2" },
  ] as IRemoteci[];
  const { container, getByRole, getByTestId, getByPlaceholderText } = render(
    <SubscribeForm remotecis={remotecis} onSubmit={mockOnSubmit} />
  );

  const subscribe_form = container.querySelector("#subscribe_form");
  expect(subscribe_form).toBeInTheDocument();

  const select = getByPlaceholderText(
    "Available Remotecis"
  ) as HTMLSelectElement;
  fireEvent.change(select, {
    target: { value: remotecis[1].name },
  });
  const option_2 = getByTestId(
    "subscribe_form__remoteci_id[1]"
  ) as HTMLButtonElement;
  fireEvent.click(option_2);

  const Subscribe = getByRole("button", { name: /Subscribe/i });
  fireEvent.click(Subscribe);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      remoteci_id: "r2",
    });
  });
});
