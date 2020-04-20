import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import selectEvent from "react-select-event";
import FeederForm from "./FeederForm2";

it("Feeder form on submit", async () => {
  const mockOnSubmit = jest.fn();
  const id = "test_feeder_form";
  const { getByTestId } = render(
    <div>
      <FeederForm
        id={id}
        onSubmit={mockOnSubmit}
        teams={[
          { id: "t1", name: "team 1" },
          { id: "t2", name: "team 2" }
        ]}
      />
      <input type="submit" form={id} />
    </div>
  );
  const form = getByTestId(id);
  expect(form).not.toBe(null);
  const name = getByTestId(`${id}-name`) as HTMLInputElement;
  expect(name.value).toBe("");
  fireEvent.change(name, { target: { value: "Feeder 1" } });
  fireEvent.submit(form);
  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "Feeder 1",
      team_id: "t1"
    });
  });
});

it("Feeder form on submit select team", async () => {
  const mockOnSubmit = jest.fn();
  const id = "test_feeder_form";
  const { container, getByTestId } = render(
    <div>
      <FeederForm
        id={id}
        onSubmit={mockOnSubmit}
        teams={[
          { id: "t1", name: "team 1" },
          { id: "t2", name: "team 2" }
        ]}
      />
      <input type="submit" form={id} />
    </div>
  );
  const form = getByTestId(id);
  expect(form).not.toBe(null);
  const name = getByTestId(`${id}-name`) as HTMLInputElement;
  expect(name.value).toBe("");
  fireEvent.change(name, { target: { value: "Feeder 1" } });
  const selectedOption = container.querySelector(
    `.${id}-teams__single-value`
  ) as HTMLElement;
  expect(selectedOption.innerHTML).toBe("team 1");
  const select = container.querySelector(`#${id}-teams`) as HTMLInputElement;
  await selectEvent.select(select, "team 2");
  fireEvent.submit(form);
  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "Feeder 1",
      team_id: "t2"
    });
  });
});


it("Feeder form with existing feeder update name", async () => {
  const mockOnSubmit = jest.fn();
  const id = "test_feeder_form";
  const { container, getByTestId } = render(
    <div>
      <FeederForm
        id={id}
        onSubmit={mockOnSubmit}
        feeder={{ id: "f1", etag: "e1", name: "feeder 1", team_id: "t2" }}
        teams={[
          { id: "t1", name: "team 1" },
          { id: "t2", name: "team 2" }
        ]}
      />
      <input type="submit" form={id} />
    </div>
  );
  const form = getByTestId(id);
  expect(form).not.toBe(null);
  const name = getByTestId(`${id}-name`) as HTMLInputElement;
  expect(name.value).toBe("feeder 1");
  const selectedOption = container.querySelector(
    `.${id}-teams__single-value`
  ) as HTMLElement;
  expect(selectedOption.innerHTML).toBe("team 2");
  fireEvent.change(name, { target: { value: "feeder 1 updated" } });
  fireEvent.submit(form);
  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "f1",
      etag: "e1",
      name: "feeder 1 updated",
      team_id: "t2"
    });
  });
});
