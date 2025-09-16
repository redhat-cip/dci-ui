import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router";

// Create a simple test component to test the URL filter functionality
function TestFilterComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [filter, setFilter] = useState(searchParams.get("filter") || "");
  const [currentUrl, setCurrentUrl] = useState(location.search);

  const updateFilter = (newFilter: string) => {
    setFilter(newFilter);
    const newParams = new URLSearchParams(searchParams);
    if (newFilter) {
      newParams.set("filter", newFilter);
    } else {
      newParams.delete("filter");
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    setCurrentUrl(location.search);
  }, [location.search]);

  return (
    <div>
      <input
        data-testid="filter-input"
        type="text"
        value={filter}
        onChange={(e) => updateFilter(e.target.value)}
        placeholder="Filter by file name, class name or testcase"
      />
      <div data-testid="current-url">{currentUrl}</div>
    </div>
  );
}

describe("URL Filter Management", () => {
  function renderWithRouter(initialEntries: string[] = ["/"]) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <TestFilterComponent />
      </MemoryRouter>,
    );
  }

  test("initializes filter from URL parameter", () => {
    const { getByTestId } = renderWithRouter(["/test?filter=example"]);

    const filterInput = getByTestId("filter-input");
    expect(filterInput).toHaveValue("example");
  });

  test("updates URL when filter changes", async () => {
    const { getByTestId } = renderWithRouter(["/test"]);

    const filterInput = getByTestId("filter-input");
    const urlDisplay = getByTestId("current-url");

    // Type in the filter input
    await userEvent.type(filterInput, "test_filter");

    // Check that the URL is updated
    expect(urlDisplay).toHaveTextContent("filter=test_filter");
  });

  test("clears filter parameter from URL when filter is empty", async () => {
    const { getByTestId } = renderWithRouter(["/test?filter=initial"]);

    const filterInput = getByTestId("filter-input");
    const urlDisplay = getByTestId("current-url");

    // Verify initial state
    expect(filterInput).toHaveValue("initial");
    expect(urlDisplay).toHaveTextContent("filter=initial");

    // Clear the filter input
    await userEvent.clear(filterInput);

    // Check that the filter parameter is removed from URL
    expect(urlDisplay).not.toHaveTextContent("filter=");
  });

  test("preserves other URL parameters when updating filter", async () => {
    const { getByTestId } = renderWithRouter([
      "/test?topic_id=123&other=param",
    ]);

    const filterInput = getByTestId("filter-input");
    const urlDisplay = getByTestId("current-url");

    // Type in the filter input
    await userEvent.type(filterInput, "new_filter");

    // Check that the URL contains both the new filter and existing parameters
    const urlText = urlDisplay.textContent || "";
    expect(urlText).toContain("filter=new_filter");
    expect(urlText).toContain("topic_id=123");
    expect(urlText).toContain("other=param");
  });
});
