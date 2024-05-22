import { fetchUserTeams, addUserToTeam, deleteUserFromTeam } from "./usersApi";
import { server } from "mocks/node";
import { HttpResponse, http } from "msw";

test("fetchUserTeams", () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/users/abc/teams", () => {
      return HttpResponse.json({ teams: [], _meta: { count: 1 } });
    }),
  );
  return fetchUserTeams({ id: "abc" });
});

test("addUserToTeam", () => {
  server.use(
    http.post(
      "https://api.distributed-ci.io/api/v1/teams/def/users/abc",
      () => {
        return new HttpResponse(null, { status: 201 });
      },
    ),
  );
  const team = { id: "def" };
  return addUserToTeam("abc", team);
});

test("deleteUserFromTeam", () => {
  server.use(
    http.delete(
      "https://api.distributed-ci.io/api/v1/teams/def/users/abc",
      () => {
        return new HttpResponse(null, { status: 204 });
      },
    ),
  );
  const user = { id: "abc" };
  const team = { id: "def" };
  return deleteUserFromTeam(user, team);
});
