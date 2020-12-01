import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditProductModal from "./EditProductModal";
import { IProduct } from "types";

test("test edit product form submit the correct values", async () => {
  const mockOnSubmit = jest.fn();

  const product = ({
    id: "p1",
    etag: "e1",
    name: "RHEL",
    description: "",
    from_now: "",
  } as unknown) as IProduct;
  const { baseElement, getByRole, getByTestId } = render(
    <EditProductModal product={product} onSubmit={mockOnSubmit} />
  );

  const showModal = getByRole("button", { name: /Edit RHEL/i });

  fireEvent.click(showModal);

  await waitFor(() => {
    expect(
      baseElement.querySelector("#edit_product_modal")
    ).toBeInTheDocument();
  });

  const product_form = baseElement.querySelector("#product_form");
  expect(product_form).toBeInTheDocument();

  const name = getByTestId("product_form__name") as HTMLInputElement;
  expect(name.value).toBe("RHEL");

  const description = getByTestId(
    "product_form__description"
  ) as HTMLInputElement;
  expect(description.value).toBe("");
  fireEvent.change(description, {
    target: {
      value: "Red Hat Entreprise Linux",
    },
  });
  expect(description.value).toBe("Red Hat Entreprise Linux");

  const editButton = getByRole("button", { name: /Edit/i });
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(product_form).not.toBeInTheDocument();
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: "p1",
      etag: "e1",
      name: "RHEL",
      description: "Red Hat Entreprise Linux",
    });
  });
});
