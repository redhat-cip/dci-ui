import { injectListEndpoint } from "api";
import type { IComponent } from "types";

const resource = "Component";

export const { useListComponentsQuery } =
  injectListEndpoint<IComponent>(resource);
