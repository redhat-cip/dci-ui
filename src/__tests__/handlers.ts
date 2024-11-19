import { http, HttpResponse } from "msw";
import { identity, products } from "./data";

export const handlers = [
  http.get("https://api.distributed-ci.io/api/v1/products", () => {
    return HttpResponse.json({
      _meta: {
        count: 3,
      },
      products,
    });
  }),
  http.get("https://api.distributed-ci.io/api/v1/identity", () => {
    return HttpResponse.json({ identity });
  }),
];

export default handlers;
