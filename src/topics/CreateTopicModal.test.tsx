import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateTopicModal from "./CreateTopicModal";
import { IProduct } from "types";

test("test create topic form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const products = [
    { id: "p1", name: "product 1" },
    { id: "p2", name: "product 2" },
  ] as IProduct[];
  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <CreateTopicModal onSubmit={mockOnSubmit} products={products} />
  );

  const showModal = getByRole("button", { name: /Create a new topic/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#create_topic_modal")
    ).toBeInTheDocument();
  });

  const topic_form = baseElement.querySelector("#topic_form");
  expect(topic_form).toBeInTheDocument();

  const name = getByTestId("topic_form__name");
  fireEvent.change(name, {
    target: {
      value: "Topic 1",
    },
  });

  const export_control = getByTestId("topic_form__export_control");
  fireEvent.click(export_control);

  const product_select = getByPlaceholderText(
    "Select a product"
  ) as HTMLSelectElement;
  expect(product_select.value).toBe("");
  fireEvent.change(product_select, {
    target: { value: products[1].name },
  });
  const option_2 = getByTestId(
    "topic_form__product_id[1]"
  ) as HTMLButtonElement;
  fireEvent.click(option_2);
  expect(product_select.value).toBe(products[1].name);

  const state = getByPlaceholderText("State") as HTMLSelectElement;
  fireEvent.change(state, {
    target: { value: "inactive" },
  });

  const component_types = getByTestId("topic_form__component_types");
  fireEvent.change(component_types, {
    target: {
      value: '["type1", "type 2"]',
    },
  });

  const data = getByTestId("topic_form__data");
  fireEvent.change(data, {
    target: {
      value: '{"secret": "password"}',
    },
  });

  const createButton = getByRole("button", { name: /Create/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(topic_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "Topic 1",
      export_control: true,
      state: "inactive",
      product_id: "p2",
      component_types: ["type1", "type 2"],
      data: { secret: "password" },
    });
  });
});
