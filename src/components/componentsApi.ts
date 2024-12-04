import { api, injectListEndpoint } from "api";
import type { IComponent, IComponentWithJobs } from "types";

const resource = "Component";

export const { useListComponentsQuery } =
  injectListEndpoint<IComponent>(resource);

export const { useGetComponentQuery } = api
  .enhanceEndpoints({ addTagTypes: ["EnhancedComponent", resource] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getComponent: builder.query<IComponentWithJobs, string>({
        query: (id) => `/components/${id}`,
        transformResponse: (response: { component: IComponentWithJobs }) =>
          response.component,
      }),
    }),
  });
