import type { ITeam } from "types";
import { buildCurrentUser } from "./authApi";

test("buildCurrentUser without a default team return the first team", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
          } as ITeam,
          t2: {
            id: "t2",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      null,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t1" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildCurrentUser with a default team return this team", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
          } as ITeam,
          t2: {
            id: "t2",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      {
        id: "t2",
      } as ITeam,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t2" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildCurrentUser remove an old team the user doesn't have access to anymore", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
          } as ITeam,
          t2: {
            id: "t2",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      {
        id: "t3",
      } as ITeam,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t1" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});
