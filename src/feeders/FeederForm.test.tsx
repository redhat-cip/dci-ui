import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import FeederForm from "./FeederForm";
import { vi } from "vitest";
import { feeder, teams } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import type { IGetTeams } from "types";
import { Button } from "@patternfly/react-core";

test("test create FeederForm submit the correct values", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/teams", () => {
      return HttpResponse.json({
        _meta: {
          count: teams.length,
        },
        teams,
      } as IGetTeams);
    }),
  );

  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <FeederForm id="create-feeder-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-feeder-form">
        Create a feeder
      </Button>
    </>,
  );

  const name = getByRole("textbox", { name: /Name/i });
  await user.type(name, "test");

  const toggle = getByRole("button", { name: "Toggle team_id select" });
  await user.click(toggle);

  const secondTeam = teams[1];
  await waitFor(() => {
    const firstTeamOption = getByRole("option", { name: secondTeam.name });
    user.click(firstTeamOption);
  });

  const createButton = getByRole("button", { name: /Create a feeder/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      team_id: teams[1].id,
    });
  });
});

test("test edit FeederForm submit the correct values", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/teams", () => {
      return HttpResponse.json({
        _meta: {
          count: teams.length,
        },
        teams,
      } as IGetTeams);
    }),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/teams/${feeder.team_id}`,
      () => {
        return HttpResponse.json({
          team: teams[0],
        });
      },
    ),
  );
  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <>
      <FeederForm
        id="edit-feeder-form"
        feeder={feeder}
        onSubmit={mockOnSubmit}
      />
      <Button variant="primary" type="submit" form="edit-feeder-form">
        Edit
      </Button>
    </>,
  );
  const name = getByRole("textbox", { name: /Name/i });
  await waitFor(() => {
    expect(name).toHaveValue(feeder.name);
  });

  await user.clear(name);
  await user.type(name, "test");

  const toggle = getByRole("button", { name: "Toggle team_id select" });
  await user.click(toggle);

  const firstTeam = teams[1];
  await waitFor(() => {
    const firstTeamOption = getByRole("option", { name: firstTeam.name });
    user.click(firstTeamOption);
  });
  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      ...feeder,
      name: "test",
      team_id: teams[1].id,
    });
  });
});

test("test FeederForm display error message", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/teams", () => {
      return HttpResponse.json({
        _meta: {
          count: teams.length,
        },
        teams,
      } as IGetTeams);
    }),
  );

  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByText } = renderWithProviders(
    <>
      <FeederForm id="create-feeder-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-feeder-form">
        Create a feeder
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a feeder/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("Feeder name is required")).toBeVisible();
    expect(getByText("Team is required")).toBeVisible();
  });
});
