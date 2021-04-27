import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateProductModal from "./CreateProductModal";

test("test create product form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const { baseElement, getByRole, getByTestId } = render(
    <CreateProductModal onSubmit={mockOnSubmit} />
  );

  const showModal = getByRole("button", { name: /Create a new product/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#create_product_modal")
    ).toBeInTheDocument();
  });

  const product_form = baseElement.querySelector("#product_form");
  expect(product_form).toBeInTheDocument();

  const name = getByTestId("product_form__name");
  fireEvent.change(name, {
    target: {
      value: "RHEL",
    },
  });

  const description = getByTestId("product_form__description");
  fireEvent.change(description, {
    target: {
      value: "Red Hat Entreprise Linux",
    },
  });

  const createButton = getByRole("button", { name: /Create/i });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(product_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "RHEL",
      description: "Red Hat Entreprise Linux",
    });
  });
});
