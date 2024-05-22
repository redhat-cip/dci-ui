import { act } from "react";
import { waitFor } from "@testing-library/react";
import CreateTopicModal from "./CreateTopicModal";
import { IProduct } from "types";
import { render } from "utils/test-utils";

test("test create topic form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();
  const products = [
    { id: "p1", name: "product 1" },
    { id: "p2", name: "product 2" },
  ] as IProduct[];

  const { user, getByRole, getByTestId } = render(
    <CreateTopicModal onSubmit={mockOnSubmit} products={products} />,
  );

  const showModal = getByRole("button", { name: /Create a new topic/i });

  user.click(showModal);

  await waitFor(() => {
    expect(getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  const name = getByRole("textbox", { name: /Name/i });
  await act(async () => {
    await user.type(name, "Topic 1");
  });

  const export_control = getByRole("checkbox", { name: "Export Control" });
  expect(export_control).toBeChecked();
  user.click(export_control);

  await user.selectOptions(getByTestId("topic-form-product_id"), "p2");
  await user.selectOptions(getByTestId("topic-form-state"), "inactive");

  const component_types = getByRole("textbox", { name: /Component types/i });
  await user.clear(component_types);
  await user.type(
    component_types,
    '["type 1", "type 2"]'.replace(/[{[]/g, "$&$&"),
  );

  const data = getByRole("textbox", { name: /Data/i });
  await user.clear(data);
  await user.type(data, '{"secret": "password"}'.replace(/[{[]/g, "$&$&"));

  user.click(getByRole("button", { name: "Create" }));

  await waitFor(() => {
    expect(name).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "Topic 1",
      export_control: false,
      state: "inactive",
      product_id: "p2",
      component_types: ["type 1", "type 2"],
      data: { secret: "password" },
    });
  });
});
