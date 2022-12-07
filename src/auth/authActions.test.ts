import { ITeam } from "types";
import { buildIdentity } from "./authActions";

test("buildIdentity without a default team return the first team", () => {
  expect(
    buildIdentity(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Identity Test",
        id: "i1",
        name: "identity-test",
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
      null
    )
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Identity Test",
    id: "i1",
    name: "identity-test",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t1" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildIdentity with a default team return this team", () => {
  expect(
    buildIdentity(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Identity Test",
        id: "i1",
        name: "identity-test",
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
      } as ITeam
    )
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Identity Test",
    id: "i1",
    name: "identity-test",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t2" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildIdentity remove an old team the user doesn't have access to anymore", () => {
  expect(
    buildIdentity(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Identity Test",
        id: "i1",
        name: "identity-test",
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
      } as ITeam
    )
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Identity Test",
    id: "i1",
    name: "identity-test",
    teams: [{ id: "t1" }, { id: "t2" }],
    timezone: "UTC-04",
    team: { id: "t1" },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});
