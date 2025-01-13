import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import { vi } from "vitest";
import TypeaheadSelect from "./TypeaheadSelect";
import { teams } from "__tests__/data";

test("test TypeaheadSelect select an option with the menu", async () => {
  const mockOnSelect = vi.fn();
  const { user, getByRole } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      name="team_id"
      placeholder="Select team"
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
    />,
  );

  const toggle = getByRole("button", { name: "Toggle team_id select" });
  await user.click(toggle);
  const firstTeam = teams[0];
  await waitFor(() => {
    const firstTeamOption = getByRole("option", { name: firstTeam.name });
    user.click(firstTeamOption);
  });
  await waitFor(() => {
    expect(mockOnSelect.mock.calls.length).toBe(1);
    expect(mockOnSelect.mock.calls[0][0]).toEqual(firstTeam);
  });
});

test("test TypeaheadSelect filter option based on user input", async () => {
  const mockOnSelect = vi.fn();
  const { user, getByRole, getAllByRole } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      name="team_id"
      placeholder="select team"
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
    />,
  );

  const textInput = getByRole("textbox");
  await user.type(textInput, "DC");
  const secondTeam = teams[1];
  await waitFor(() => {
    const option = getByRole("option", { name: secondTeam.name });
    expect(option).toBeVisible();
    const options = getAllByRole("option");
    expect(options.length).toBe(1);
  });
});

test("test TypeaheadSelect display no results if input doesn't match", async () => {
  const mockOnSelect = vi.fn();
  const { user, getByRole } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      name="team_id"
      placeholder="select team"
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
    />,
  );

  const textInput = getByRole("textbox");
  await user.type(textInput, "No match");
  await waitFor(() => {
    const option = getByRole("option", {
      name: 'No results found for "No match"',
    });
    expect(option).toBeDisabled();
  });
});

test("test TypeaheadSelect display loading icon if no match but isFetching is true", async () => {
  const mockOnSelect = vi.fn();
  const { user, getByRole, getByLabelText } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      name="team_id"
      placeholder="select team"
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
      isFetching
    />,
  );

  const textInput = getByRole("textbox");
  await user.type(textInput, "No match");
  await waitFor(() => {
    const loadingIcon = getByLabelText("loading");
    expect(loadingIcon).toBeVisible();
  });
});

test("test TypeaheadSelect when user click arrow down or up, it select the team", async () => {
  const mockOnSelect = vi.fn();
  const { user, getByRole, getAllByRole } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      name="team_id"
      placeholder="select team"
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
      isFetching
    />,
  );
  const textInput = getByRole("textbox");
  await user.click(textInput);

  await waitFor(() => {
    const options = getAllByRole("option");
    expect(options.length).toBe(2);
  });

  // go down select first
  await user.keyboard("[ArrowDown]");
  await waitFor(() => {
    const option = getByRole("option", { name: teams[0].name });
    expect(option.tabIndex).toBe(0);
    const option2 = getByRole("option", { name: teams[1].name });
    expect(option2.tabIndex).toBe(-1);
  });

  // go down select second
  await user.keyboard("[ArrowDown]");
  await waitFor(() => {
    const option = getByRole("option", { name: teams[0].name });
    expect(option.tabIndex).toBe(-1);
    const option2 = getByRole("option", { name: teams[1].name });
    expect(option2.tabIndex).toBe(0);
  });

  // go up select first
  await user.keyboard("[ArrowUp]");
  await waitFor(() => {
    const option = getByRole("option", { name: teams[0].name });
    expect(option.tabIndex).toBe(0);
    const option2 = getByRole("option", { name: teams[1].name });
    expect(option2.tabIndex).toBe(-1);
  });

  // go up select last
  await user.keyboard("[ArrowUp]");
  await waitFor(() => {
    const option = getByRole("option", { name: teams[0].name });
    expect(option.tabIndex).toBe(-1);
    const option2 = getByRole("option", { name: teams[1].name });
    expect(option2.tabIndex).toBe(0);
  });
});

test("test TypeaheadSelect with item display item name", async () => {
  const mockOnSelect = vi.fn();
  const { getByRole } = render(
    <TypeaheadSelect
      id="typeahead-select-test"
      placeholder="select team"
      item={teams[1]}
      items={teams}
      onSelect={mockOnSelect}
      onSearch={() => undefined}
    />,
  );

  const textInput = getByRole("textbox");
  await waitFor(() => {
    expect(textInput).toHaveValue(teams[1].name);
  });
});
