import http from "services/http";
import { createActions } from "api/apiActions";
import { AppThunk } from "store";
import { IComponent, ITopic } from "types";

export default createActions("topic");

interface IFetchLatestComponents {
  data: {
    components: IComponent[];
  };
}

// todo remove app thunk
export function fetchLatestComponents(
  topic: ITopic
): AppThunk<Promise<IFetchLatestComponents>> {
  return () => {
    return Promise.all(
      topic.component_types.map((componentType) =>
        http({
          method: "get",
          url: `/api/v1/topics/${topic.id}/components`,
          params: {
            sort: "-created_at",
            limit: 1,
            offset: 0,
            where: `type:${componentType},state:active`,
          },
        })
      )
    ).then((results) => {
      const components = results.reduce(
        (acc, result) => acc.concat(result.data.components),
        [] as IComponent[]
      );
      return Promise.resolve({ data: { components } });
    });
  };
}
