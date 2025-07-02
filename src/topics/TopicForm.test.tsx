import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import TopicForm from "./TopicForm";
import { vi } from "vitest";
import { topic, products } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import type { IGetProducts } from "types";
import { Button } from "@patternfly/react-core";

test("test create TopicForm submit the correct values", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products", () => {
      return HttpResponse.json({
        _meta: {
          count: products.length,
        },
        products,
      } as IGetProducts);
    }),
  );

  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <TopicForm id="create-topic-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-topic-form">
        Create a topic
      </Button>
    </>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  await user.type(name, "test");

  const export_control = getByRole("checkbox", { name: /Export Control/i });
  await user.click(export_control);

  const toggle = getByRole("button", { name: "Select a product" });
  await user.click(toggle);

  const secondProduct = products[1];
  await waitFor(() => {
    const firstProductOption = getByRole("option", {
      name: secondProduct.name,
    });
    user.click(firstProductOption);
  });

  await user.selectOptions(getByRole("combobox"), "inactive");

  const createButton = getByRole("button", { name: /Create a topic/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      export_control: false,
      product_id: "p2",
      state: "inactive",
      component_types: [],
      data: {},
    });
  });
});

test("test edit TopicForm submit the correct values", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products", () => {
      return HttpResponse.json({
        _meta: {
          count: products.length,
        },
        products,
      } as IGetProducts);
    }),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/products/${topic.product_id}`,
      () => {
        return HttpResponse.json({
          product: products[0],
        });
      },
    ),
  );
  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <TopicForm id="edit-topic-form" topic={topic} onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="edit-topic-form">
        Edit
      </Button>
    </>,
  );
  const name = getByRole("textbox", { name: /Name/i });
  await user.clear(name);
  await user.type(name, "OCP-4.17");

  const export_control = getByRole("checkbox", { name: /Export Control/i });
  await user.click(export_control);

  const toggle = getByRole("button", { name: "Select a product" });
  await user.click(toggle);

  const secondProduct = products[1];
  await waitFor(() => {
    const firstProductOption = getByRole("option", {
      name: secondProduct.name,
    });
    user.click(firstProductOption);
  });

  await user.selectOptions(getByRole("combobox"), "inactive");

  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...topic,
      name: "OCP-4.17",
      export_control: false,
      product_id: "p2",
      state: "inactive",
    });
  });
});

test("test TopicForm display error message", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products", () => {
      return HttpResponse.json({
        _meta: {
          count: products.length,
        },
        products,
      } as IGetProducts);
    }),
  );

  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByText } = renderWithProviders(
    <>
      <TopicForm id="create-topic-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-topic-form">
        Create a topic
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a topic/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("Topic name is required")).toBeVisible();
    expect(getByText("Product is required")).toBeVisible();
  });
});
