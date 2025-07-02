import { renderWithProviders } from "__tests__/renders";
import { server } from "__tests__/node";
import { remotecis } from "__tests__/data";
import RemotecisPage from "./RemotecisPage";
import type { IGetRemotecis } from "types";
import { HttpResponse, http } from "msw";

test("Should display remotecis in remotecis page", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/remotecis", () => {
      return HttpResponse.json({
        _meta: {
          count: remotecis.length,
        },
        remotecis,
      } as IGetRemotecis);
    }),
  );
  const { findByText } = renderWithProviders(<RemotecisPage />);
  await findByText("Remoteci admin");
});
