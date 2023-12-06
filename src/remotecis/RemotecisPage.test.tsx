import { renderWithProviders } from "utils/test-utils";
import RemotecisPage from "./RemotecisPage";
import type { RemoteciListResponse } from "../types";
import { server } from "mocks/node";
import { rest } from "msw";

test("Should display remotecis in remotecis page", async () => {
  server.use(
    rest.get(
      "https://api.distributed-ci.io/api/v1/remotecis",
      (req, res, ctx) => {
        const remotecis: RemoteciListResponse = {
          _meta: {
            count: 1,
          },
          remotecis: [
            {
              api_secret:
                "F4trsVQGiMRQgBBsx5AqVugQIGUVqqidaUDzaMn4P243NVa1RchR0jBrTk7yMpYH",
              created_at: "2023-12-05T09:42:14.304617",
              data: {},
              etag: "38a612f7a53613e4ce607753b9eb2210",
              id: "f1371754-462f-4cfa-bed3-8cd6c9c60515",
              name: "Remoteci admin",
              public: false,
              state: "active",
              team_id: "e5147a96-7c76-4415-b01e-edefba96a9c8",
              updated_at: "2023-12-05T09:42:14.304617",
            },
          ],
        };
        return res(ctx.json(remotecis));
      },
    ),
  );
  const { findByText } = renderWithProviders(<RemotecisPage />);
  await findByText("Remoteci admin");
});
