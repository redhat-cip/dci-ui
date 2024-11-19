import { renderWithProviders } from "__tests__/renders";
import { server } from "__tests__/node";
import { remotecis } from "__tests__/data";
import RemotecisPage from "./RemotecisPage";
import type { RemoteciListResponse } from "../types";
import { HttpResponse, http } from "msw";

test("Should display remotecis in remotecis page", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/remotecis", () => {
      return HttpResponse.json({
        _meta: {
          count: 1,
        },
        remotecis,
      } as RemoteciListResponse);
    }),
  );
  const { findByText, debug } = renderWithProviders(<RemotecisPage />);
  debug();
  await findByText("Remoteci admin");
});
