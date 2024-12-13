import { renderWithProviders } from "__tests__/renders";
import ComponentsPage from "./ComponentsPage";
import type { IGetComponents } from "../types";
import { HttpResponse, http } from "msw";
import { server } from "__tests__/node";
import { components } from "__tests__/data";

test("Should display components in components page", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/components", () => {
      return HttpResponse.json({
        _meta: {
          count: 2,
        },
        components,
      } as IGetComponents);
    }),
  );
  const { findByText } = renderWithProviders(<ComponentsPage />);
  await findByText("RHEL-8.8.0-20230125.0");
  await findByText("RHEL-9.2.0-20230125.12");
});
