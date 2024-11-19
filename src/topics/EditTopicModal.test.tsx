import { waitFor } from "@testing-library/react";
import EditTopicModal from "./EditTopicModal";
import { ITopic, IProduct } from "types";
import { render } from "__tests__/renders";
import { vi } from "vitest";

test("test edit topic form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();

  const topic = {
    id: "t1",
    name: "Topic 1",
    export_control: false,
    state: "inactive",
    product_id: "p2",
    component_types: ["type 1", "type 2"],
    data: { secret: "password" },
  } as unknown as ITopic;
  const products = [
    { id: "p1", name: "product 1" },
    { id: "p2", name: "product 2" },
  ] as IProduct[];

  const { user, getByRole, getByTestId } = render(
    <EditTopicModal
      products={products}
      topic={topic}
      onSubmit={mockOnSubmit}
    />,
  );

  const showModal = getByRole("button", { name: /Edit Topic 1/i });

  user.click(showModal);

  await waitFor(() => {
    expect(getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  const name = getByRole("textbox", { name: /Name/i });
  expect(name).toHaveValue("Topic 1");
  await user.clear(name);
  await user.type(name, "Edited topic 1");

  const export_control = getByRole("checkbox", { name: "Export Control" });
  expect(export_control).not.toBeChecked();
  user.click(export_control);

  expect(getByTestId("topic-form-product_id")).toHaveValue("p2");
  await user.selectOptions(getByTestId("topic-form-product_id"), "p1");

  expect(getByTestId("topic-form-state")).toHaveValue("inactive");
  await user.selectOptions(getByTestId("topic-form-state"), "active");

  const component_types = getByRole("textbox", { name: /Component types/i });
  expect(component_types).toHaveValue('["type 1","type 2"]');
  await user.clear(component_types);
  await user.type(component_types, '["type 2"]'.replace(/[{[]/g, "$&$&"));

  const data = getByRole("textbox", { name: /Data/i });
  expect(data).toHaveValue('{"secret":"password"}');
  await user.clear(data);
  await user.type(data, "{}".replace(/[{[]/g, "$&$&"));

  // await user.selectOptions(getByTestId("topic-form-product_id"), "p2");

  // const product_select = getByPlaceholderText(
  //   "Select a product",
  // ) as HTMLSelectElement;
  // expect(product_select.value).toBe("product 2");
  // fireEvent.change(product_select, {
  //   target: { value: products[0].name },
  // });
  // const option_1 = getByTestId(
  //   "topic_form__product_id[0]",
  // ) as HTMLButtonElement;
  // fireEvent.click(option_1);

  // const state = getByPlaceholderText("State") as HTMLSelectElement;
  // fireEvent.change(state, {
  //   target: { value: "active" },
  // });

  // const component_types = getByTestId("topic_form__component_types");
  // fireEvent.change(component_types, {
  //   target: {
  //     value: '["type 2"]',
  //   },
  // });

  // const data = getByTestId("topic_form__data");
  // fireEvent.change(data, {
  //   target: {
  //     value: "",
  //   },
  // });

  // const editButton = getByRole("button", { name: /Edit/i });
  // fireEvent.click(editButton);
  user.click(getByRole("button", { name: /Edit/i }));

  await waitFor(() => {
    expect(name).not.toBeInTheDocument();
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
