import { renderWithProviders } from "utils/test-utils";
import ComponentsPage from "./ComponentsPage";
import type { ComponentListResponse } from "../types";
import { server } from "mocks/node";
import { HttpResponse, http } from "msw";

test("Should display components in components page", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/components", () => {
      const components: ComponentListResponse = {
        _meta: {
          count: 2,
        },
        components: [
          {
            created_at: "2023-12-05T09:42:14.007890",
            data: {},
            display_name: "RHEL-8.8.0-20230125.0",
            etag: "716b9cd7255c7c65d68dc23fb9abce31",
            id: "914120f6-f33c-41b9-8245-19f9ff1f4c03",
            released_at: "2023-12-05T09:42:14.008496",
            state: "active",
            tags: [],
            team_id: null,
            topic_id: "4d61a6ce-1d7c-41fb-911e-075bc4216090",
            type: "compose",
            uid: "",
            updated_at: "2023-12-05T09:42:14.007890",
            url: "",
            version: "8.8.0-20230125.0",
          },
          {
            created_at: "2023-12-05T09:42:13.690572",
            data: {},
            display_name: "RHEL-9.2.0-20230125.12",
            etag: "354f78ee3a5c43fa64fe7df1a76240b1",
            id: "f602a981-5bcd-42fd-8f45-b13fdfbd3acf",
            released_at: "2023-12-05T09:42:13.692187",
            state: "active",
            tags: [],
            team_id: null,
            topic_id: "33594e69-f4f8-47fc-a773-e3e0c0724e70",
            type: "compose",
            uid: "",
            updated_at: "2023-12-05T09:42:13.690572",
            url: "",
            version: "9.2.0-20230125.12",
          },
        ],
      };
      return HttpResponse.json(components);
    }),
  );
  const { findByText } = renderWithProviders(<ComponentsPage />);
  await findByText("RHEL-8.8.0-20230125.0");
  await findByText("RHEL-9.2.0-20230125.12");
});
