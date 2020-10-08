import productsActions from "products/productsActions";
import teamsActions from "teams/teamsActions";
import topicsActions from "topics/topicsActions";

import http from "services/http";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { sortByName } from "services/sort";

export function getProductsWithTeams() {
  return (dispatch, getState) => {
    return dispatch(productsActions.all()).then((response) => {
      const products = response.data.products;
      const state = getState();
      const promises = products.map((product) =>
        http({
          method: "get",
          url: `${state.config.apiURL}/api/v1/products/${product.id}/teams`,
        })
      );
      return Promise.all(promises).then((responses) => {
        responses.forEach((response, index) => {
          products[index].teams = sortByName(response.data.teams);
        });
        return Promise.resolve(sortByName(products));
      });
    });
  };
}

export function getTopicsWithTeams() {
  return (dispatch) => {
    return dispatch(topicsActions.all({ embed: "teams" })).then((response) => {
      return Promise.resolve(sortByName(response.data.topics));
    });
  };
}

export function getTeams() {
  return (dispatch) => {
    return dispatch(teamsActions.all()).then((response) => {
      return Promise.resolve(sortByName(response.data.teams));
    });
  };
}

function grantTeamPermission(resource_name, team, resource) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "post",
      url: `${state.config.apiURL}/api/v1/${resource_name}s/${resource.id}/teams`,
      data: { team_id: team.id },
    })
      .then((response) => {
        dispatch(
          showSuccess(
            `${team.name} can download components for the ${resource_name} ${resource.name}`
          )
        );
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
      });
  };
}

function removeTeamPermission(resource_name, team, resource) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "delete",
      url: `${state.config.apiURL}/api/v1/${resource_name}s/${resource.id}/teams/${team.id}`,
    })
      .then((response) => {
        dispatch(
          showSuccess(
            `${team.name} to ${resource.name} permission successfully removed`
          )
        );
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
      });
  };
}

export function grantTeamProductPermission(team, product) {
  return grantTeamPermission("product", team, product);
}

export function removeTeamProductPermission(team, product) {
  return removeTeamPermission("product", team, product);
}

export function grantTeamTopicPermission(team, topic) {
  return grantTeamPermission("topic", team, topic);
}

export function removeTeamTopicPermission(team, topic) {
  return removeTeamPermission("topic", team, topic);
}
