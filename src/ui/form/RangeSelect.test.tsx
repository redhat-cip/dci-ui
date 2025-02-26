import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import { vi } from "vitest";
import RangeSelect from "./RangeSelect";

test("test RangeSelect datepicker after", async () => {
  const mockOnChange = vi.fn();
  const { user, getByRole } = render(
    <RangeSelect
      now="2024-12-10"
      range="custom"
      after="2024-12-03"
      before="2024-12-10"
      onChange={mockOnChange}
      ranges={["last7Days", "custom"]}
    />,
  );
  const after = await getByRole("button", { name: "Toggle after date picker" });
  await expect(after).toBeVisible();
  await user.click(after);
  await user.click(getByRole("button", { name: "6 December 2024" }));
  await waitFor(() => {
    expect(mockOnChange.mock.calls.length).toBe(1);
    expect(mockOnChange.mock.calls[0]).toEqual([
      "custom",
      "2024-12-06",
      "2024-12-10",
    ]);
  });
});

test("test RangeSelect datepicker before", async () => {
  const mockOnChange = vi.fn();
  const { user, getByRole } = render(
    <RangeSelect
      now="2024-12-10"
      range="custom"
      after="2024-12-03"
      before="2024-12-10"
      onChange={mockOnChange}
      ranges={["last7Days", "custom"]}
    />,
  );
  const before = await getByRole("button", {
    name: "Toggle before date picker",
  });
  await expect(before).toBeVisible();
  await user.click(before);
  await user.click(getByRole("button", { name: "6 December 2024" }));
  await waitFor(() => {
    expect(mockOnChange.mock.calls.length).toBe(1);
    expect(mockOnChange.mock.calls[0]).toEqual([
      "custom",
      "2024-12-03",
      "2024-12-06",
    ]);
  });
});
