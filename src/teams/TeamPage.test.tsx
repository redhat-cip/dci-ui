import { renderWithProviders } from "__tests__/renders";
import { server } from "__tests__/node";
import { products, teams, users } from "__tests__/data";
import { HttpResponse, http } from "msw";
import App from "App";
import { IGetProducts, IGetUsers } from "types";

test("Should display teams in team page", async () => {
  const team = teams[0];
  const teamId = teams[0].id;
  server.use(
    http.get(`https://api.distributed-ci.io/api/v1/teams/${teamId}`, () => {
      return HttpResponse.json({ team });
    }),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/teams/${teamId}/users`,
      () => {
        return HttpResponse.json({
          _meta: {
            count: users.length,
          },
          users,
        } as IGetUsers);
      },
    ),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/teams/${teamId}/products`,
      () => {
        return HttpResponse.json({
          _meta: {
            count: products.length,
          },
          products,
        } as IGetProducts);
      },
    ),
  );
  server.use(
    http.get(`https://api.distributed-ci.io/api/v1/products`, () => {
      return HttpResponse.json({
        _meta: {
          count: products.length,
        },
        products,
      } as IGetProducts);
    }),
  );
  server.use(
    http.get(
      `https://api.distributed-ci.io/api/v1/teams/${teamId}/permissions/components`,
      () => {
        return HttpResponse.json({ _meta: { count: 0 }, teams: [] });
      },
    ),
  );
  const { findByRole, getByRole } = renderWithProviders(<App />, {
    initialEntries: [`/teams/${teamId}`],
  });
  await findByRole("link", { name: users[0].name });
  expect(getByRole("link", { name: users[0].name })).toHaveAttribute(
    "href",
    `/users/${users[0].id}`,
  );
});
