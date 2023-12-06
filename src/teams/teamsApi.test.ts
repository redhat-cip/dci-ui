import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { getProductsTeamHasAccessTo } from "./teamsApi";
import { IProduct, ITeam } from "types";

const axiosMock = new axiosMockAdapter(axios);

test("getProductsTeamHasAccessTo", () => {
  const team = { id: "t1", name: "Team 1" } as ITeam;
  const products = [
    { id: "p1", name: "RHEL" },
    { id: "p2", name: "OpenStack" },
  ] as unknown as IProduct[];
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p1/teams")
    .reply(200, { teams: [team], _meta: { count: 1 } });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p2/teams")
    .reply(200, { teams: [], _meta: { count: 1 } });
  return getProductsTeamHasAccessTo(team, products).then((products) => {
    expect(products[0].id).toBe("p1");
    expect(products.length).toBe(1);
  });
});
