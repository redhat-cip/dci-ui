import { render, fireEvent, waitFor } from "@testing-library/react";
import EditTopicModal from "./EditTopicModal";
import { ITopic, IProduct } from "types";

test("test edit topic form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const topic = {
    id: "t1",
    name: "Topic 1",
    export_control: true,
    state: "inactive",
    product_id: "p2",
    component_types: ["type1", "type 2"],
    data: { secret: "password" },
    from_now: "15 second ago",
  } as unknown as ITopic;
  const products = [
    { id: "p1", name: "product 1" },
    { id: "p2", name: "product 2" },
  ] as IProduct[];

  const { baseElement, getByRole, getByTestId, getByPlaceholderText } = render(
    <EditTopicModal products={products} topic={topic} onSubmit={mockOnSubmit} />
  );

  const showModal = getByRole("button", { name: /Edit Topic 1/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(baseElement.querySelector("#edit_topic_modal")).toBeInTheDocument();
  });

  const topic_form = baseElement.querySelector("#topic_form");
  expect(topic_form).toBeInTheDocument();

  const name = getByTestId("topic_form__name") as HTMLInputElement;
  expect(name.value).toBe("Topic 1");
  fireEvent.change(name, {
    target: {
      value: "Edited topic 1",
    },
  });

  const product_select = getByPlaceholderText(
    "Select a product"
  ) as HTMLSelectElement;
  expect(product_select.value).toBe("product 2");
  fireEvent.change(product_select, {
    target: { value: products[0].name },
  });
  const option_1 = getByTestId(
    "topic_form__product_id[0]"
  ) as HTMLButtonElement;
  fireEvent.click(option_1);

  const state = getByPlaceholderText("State") as HTMLSelectElement;
  fireEvent.change(state, {
    target: { value: "active" },
  });

  const component_types = getByTestId("topic_form__component_types");
  fireEvent.change(component_types, {
    target: {
      value: '["type 2"]',
    },
  });

  const data = getByTestId("topic_form__data");
  fireEvent.change(data, {
    target: {
      value: "",
    },
  });

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(topic_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "t1",
      name: "Edited topic 1",
      export_control: true,
      state: "active",
      product_id: "p1",
      component_types: ["type 2"],
      data: {},
    });
  });
});
