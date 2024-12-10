import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import { vi } from "vitest";
import RangeSelect from "./RangeSelect";

test("test RangeToolbarItem use first ranges as default", async () => {
  const mockOnChange = vi.fn();
  render(
    <RangeSelect
      now="2024-12-10"
      range={null}
      after={null}
      before={null}
      onChange={mockOnChange}
      ranges={["last7Days", "custom"]}
    />,
  );
  await waitFor(() => {
    expect(mockOnChange.mock.calls.length).toBe(1);
    expect(mockOnChange.mock.calls[0]).toEqual([
      "last7Days",
      "2024-12-03",
      "2024-12-10",
    ]);
  });
});

test("test RangeToolbarItem update after and before value accordingly to the user range selection", async () => {
  const mockOnChange = vi.fn();
  const { user, getByRole } = render(
    <RangeSelect
      now="2024-12-10"
      range={null}
      after={null}
      before={null}
      onChange={mockOnChange}
      ranges={["last7Days", "lastMonth", "custom"]}
    />,
  );
  await user.selectOptions(getByRole("combobox"), "Last month");
  await waitFor(() => {
    expect(mockOnChange.mock.calls.length).toBe(2);
    expect(mockOnChange.mock.calls[1]).toEqual([
      "lastMonth",
      "2024-11-01",
      "2024-11-30",
    ]);
  });
});

test("test RangeToolbarItem custom period selection", async () => {
  const mockOnChange = vi.fn();
  const { user, getByRole, getAllByRole } = render(
    <RangeSelect
      now="2024-12-10"
      range={null}
      after={null}
      before={null}
      onChange={mockOnChange}
      ranges={["last7Days", "custom"]}
    />,
  );
  await user.selectOptions(getByRole("combobox"), "Custom period");

  const after = await getByRole("button", { name: "Toggle after date picker" });
  await expect(after).not.toBeDisabled();
  await user.click(after);
  await user.click(getByRole("button", { name: "6 December 2024" }));

  const before = await getByRole("button", {
    name: "Toggle before date picker",
  });
  await user.click(before);
  await user.click(getAllByRole("button", { name: "7 December 2024" })[1]);

  await waitFor(() => {
    expect(mockOnChange.mock.calls.length).toBe(4);
    expect(mockOnChange.mock.calls[1]).toEqual([
      "custom",
      "2024-12-03",
      "2024-12-10",
    ]);
    expect(mockOnChange.mock.calls[2]).toEqual([
      "custom",
      "2024-12-06",
      "2024-12-10",
    ]);
    expect(mockOnChange.mock.calls[3]).toEqual([
      "custom",
      "2024-12-06",
      "2024-12-07",
    ]);
  });
});
