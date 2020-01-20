import http from "services/http";
import { createActions } from "api/apiActions";

export default createActions("topic");

export function fetchLatestComponents(topic) {
  return (dispatch, getState) => {
    const state = getState();
    return Promise.all(
      topic.component_types.map(componentType =>
        http({
          method: "get",
          url: `${state.config.apiURL}/api/v1/topics/${topic.id}/components`,
          params: {
            sort: "-created_at",
            limit: 1,
            offset: 0,
            where: `type:${componentType},state:active`
          }
        })
      )
    ).then(results => {
      const components = results.reduce(
        (acc, result) => acc.concat(result.data.components),
        []
      );
      return Promise.resolve({ data: { components } });
    });
  };
}
