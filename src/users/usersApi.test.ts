import { fetchUserTeams, addUserToTeam, deleteUserFromTeam } from "./usersApi";
import { HttpResponse, http } from "msw";
import { server } from "__tests__/node";
import { IUser } from "types";
import { users, teams } from "__tests__/data";

test("fetchUserTeams", () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/users/abc/teams", () => {
      return HttpResponse.json({ teams: [], _meta: { count: 1 } });
    }),
  );
  return fetchUserTeams({ id: "abc" } as IUser);
});

test("addUserToTeam", () => {
  const team = teams[0];
  const user = users[0];
  server.use(
    http.post(
      `https://api.distributed-ci.io/api/v1/teams/${team.id}/users/${user.id}`,
      () => {
        return new HttpResponse(null, { status: 201 });
      },
    ),
  );
  return addUserToTeam(user.id, team);
});

test("deleteUserFromTeam", () => {
  const team = teams[0];
  server.use(
    http.delete(
      `https://api.distributed-ci.io/api/v1/teams/${team.id}/users/${users[0].id}`,
      () => {
        return new HttpResponse(null, { status: 204 });
      },
    ),
  );
  return deleteUserFromTeam(users[0], team);
});
