import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import ProductForm from "./ProductForm";
import { vi } from "vitest";
import { products } from "__tests__/data";
import { Button } from "@patternfly/react-core";

test("test create ProductForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <ProductForm id="create-product-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-product-form">
        Create a product
      </Button>
    </>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  await user.type(name, "test");

  const description = getByRole("textbox", { name: /Description/i });
  await user.type(description, "description");

  const createButton = getByRole("button", { name: /Create a product/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      description: "description",
    });
  });
});

test("test edit ProductForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <ProductForm
        id="edit-product-form"
        product={products[0]}
        onSubmit={mockOnSubmit}
      />
      <Button variant="primary" type="submit" form="edit-product-form">
        Edit
      </Button>
    </>,
  );
  const name = getByRole("textbox", { name: /Name/i });
  await user.clear(name);
  await user.type(name, "new name");

  const description = getByRole("textbox", { name: /Description/i });
  await user.clear(description);
  await user.type(description, "description 2");

  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...products[0],
      name: "new name",
      description: "description 2",
    });
  });
});

test("test ProductForm display error message", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByText } = renderWithProviders(
    <>
      <ProductForm id="create-product-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-product-form">
        Create a product
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a product/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("Product name is required")).toBeVisible();
  });
});
