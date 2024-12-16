import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import RemoteciForm from "./RemoteciForm";
import { vi } from "vitest";
import { remotecis, teams } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import { IGetTeams } from "types";
import { Button } from "@patternfly/react-core";

test("test create RemoteciForm submit the correct values", async () => {
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
      <RemoteciForm id="create-remoteci-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-remoteci-form">
        Create a remoteci
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

  const createButton = getByRole("button", { name: /Create a remoteci/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      team_id: teams[1].id,
    });
  });
});

test("test edit RemoteciForm submit the correct values", async () => {
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
      `https://api.distributed-ci.io/api/v1/teams/${remotecis[0].team_id}`,
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
      <RemoteciForm
        id="edit-remoteci-form"
        remoteci={remotecis[0]}
        onSubmit={mockOnSubmit}
      />
      <Button variant="primary" type="submit" form="edit-remoteci-form">
        Edit
      </Button>
    </>,
  );
  const name = getByRole("textbox", { name: /Name/i });
  await waitFor(() => {
    expect(name).toHaveValue(remotecis[0].name);
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
      ...remotecis[0],
      name: "test",
      team_id: teams[1].id,
    });
  });
});

test("test RemoteciForm display error message", async () => {
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
      <RemoteciForm id="create-remoteci-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-remoteci-form">
        Create a remoteci
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a remoteci/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("Remoteci name is required")).toBeVisible();
    expect(getByText("Team is required")).toBeVisible();
  });
});
