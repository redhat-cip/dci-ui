import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import { vi } from "vitest";
import TeamSelect from "./TeamSelect";
import { teams } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import type { IGetTeams } from "types";

test("test TeamSelect when user type, a debounced request with query is made", async () => {
  const search = teams[1].name;
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/teams", ({ request }) => {
      const url = new URL(request.url);
      const where = url.searchParams.get("where") || "";
      if (where.includes(search)) {
        return HttpResponse.json({
          _meta: {
            count: 1,
          },
          teams: [teams[1]],
        } as IGetTeams);
      }
      return HttpResponse.json({
        _meta: {
          count: 0,
        },
        teams: [teams[0]],
      } as IGetTeams);
    }),
  );

  const mockOnSelect = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <TeamSelect id="team-select" name="team_id" onSelect={mockOnSelect} />,
  );

  const textInput = getByRole("textbox");
  await user.type(textInput, search);

  await waitFor(() => {
    const option = getByRole("option", { name: teams[1].name });
    expect(option).toBeVisible();
  });
});
