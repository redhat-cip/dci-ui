import { server } from "__tests__/node";
import { getProductsTeamHasAccessTo } from "./teamsApi";
import { HttpResponse, http } from "msw";
import { teams, products } from "__tests__/data";

test.only("getProductsTeamHasAccessTo", () => {
  const product = products[0];
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/products/${product.id}/teams`,
      () => {
        return HttpResponse.json({ teams, _meta: { count: teams.length } });
      },
    ),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/products/${products[1].id}/teams`,
      () => {
        return HttpResponse.json({ teams: [], _meta: { count: 0 } });
      },
    ),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/products/${products[2].id}/teams`,
      () => {
        return HttpResponse.json({ teams: [], _meta: { count: 0 } });
      },
    ),
  );
  return getProductsTeamHasAccessTo(teams[0], products).then((products) => {
    expect(products[0].id).toBe(products[0].id);
    expect(products.length).toBe(1);
  });
});
