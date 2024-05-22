import { getProductsTeamHasAccessTo } from "./teamsApi";
import { IProduct, ITeam } from "types";
import { server } from "mocks/node";
import { HttpResponse, http } from "msw";

test("getProductsTeamHasAccessTo", () => {
  const team = { id: "t1", name: "Team 1" } as ITeam;
  const products = [
    { id: "p1", name: "RHEL" },
    { id: "p2", name: "OpenStack" },
  ] as unknown as IProduct[];
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products/p1/teams", () => {
      return HttpResponse.json({ teams: [team], _meta: { count: 1 } });
    }),
  );
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products/p2/teams", () => {
      return HttpResponse.json({ teams: [], _meta: { count: 1 } });
    }),
  );
  return getProductsTeamHasAccessTo(team, products).then((products) => {
    expect(products[0].id).toBe("p1");
    expect(products.length).toBe(1);
  });
});
