import http from "./http";
import { useQuery, useMutation, queryCache } from "react-query";
import { useConfig } from "auth/configContext";

export default resource => {
  const { config } = useConfig();
  const { apiURL } = config;
  const resources = `${resource}s`;
  const { data, error, status } = useQuery(resources, () =>
    http
      .get(`${apiURL}/api/v1/${resources}/`)
      .then(response => response.data[resources])
  );

  const [create] = useMutation(
    async newResource => {
      queryCache.setQueryData(resources, [...data, newResource]);
      return http
        .post(`${apiURL}/api/v1/${resources}/`, newResource)
        .then(response => response.data[resource]);
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries(resources);
      }
    }
  );

  const [update] = useMutation(
    async newResource => {
      queryCache.setQueryData(
        resources,
        data.map(d => {
          if (newResource.id === d.id) return { ...d, ...newResource };
          return d;
        })
      );
      return http
        .put(`${apiURL}/api/v1/${resources}/${newResource.id}/`, newResource, {
          headers: { "If-Match": newResource.etag }
        })
        .then(response => response.data[resource]);
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries(resources);
      }
    }
  );

  const [remove] = useMutation(
    async newResource => {
      queryCache.setQueryData(
        resources,
        data.filter(d => d.id !== newResource.id)
      );
      return http.delete(`${apiURL}/api/v1/${resources}/${newResource.id}/`, {
        headers: { "If-Match": newResource.etag }
      });
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries(resources);
      }
    }
  );

  return {
    [resources]: data || [],
    create,
    update,
    remove,
    error,
    status
  };
};
