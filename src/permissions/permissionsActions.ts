import productsActions from "products/productsActions";
import teamsActions from "teams/teamsActions";
import topicsActions from "topics/topicsActions";
import http from "services/http";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { sortByName } from "services/sort";
import {
  IProduct,
  IProductWithTeams,
  ITeam,
  ITopic,
  ITopicWithTeams,
} from "types";
import { AxiosPromise } from "axios";
import { AppThunk } from "store";

export function getProductsWithTeams(): AppThunk<Promise<IProductWithTeams[]>> {
  return (dispatch) => {
    return dispatch(productsActions.all()).then((response) => {
      const products = response.data.products as IProduct[];
      const promises = products.map((product) =>
        http({
          method: "get",
          url: `/api/v1/products/${product.id}/teams`,
        })
      );
      const productsWithTeams: IProductWithTeams[] = [];
      return Promise.all(promises).then((responses) => {
        responses.forEach((response, index) => {
          productsWithTeams.push({
            ...products[index],
            teams: sortByName(response.data.teams),
          });
        });
        return Promise.resolve(sortByName(productsWithTeams));
      });
    });
  };
}

export function getTopicsWithTeams(): AppThunk<Promise<ITopicWithTeams[]>> {
  return (dispatch) => {
    return dispatch(topicsActions.all()).then((response) => {
      return Promise.resolve(sortByName(response.data.topics));
    });
  };
}

export function getTeams(): AppThunk<Promise<ITeam[]>> {
  return (dispatch) => {
    return dispatch(teamsActions.all()).then((response) => {
      return Promise.resolve(sortByName(response.data.teams));
    });
  };
}

function grantTeamPermission(
  resource_name: string,
  team: ITeam,
  resource: ITopic | IProduct
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return http({
      method: "post",
      url: `/api/v1/${resource_name}s/${resource.id}/teams`,
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
        return error;
      });
  };
}

function removeTeamPermission(
  resource_name: string,
  team: ITeam,
  resource: ITopic | IProduct
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return http({
      method: "delete",
      url: `/api/v1/${resource_name}s/${resource.id}/teams/${team.id}`,
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
        return error;
      });
  };
}

export function grantTeamProductPermission(team: ITeam, product: IProduct) {
  return grantTeamPermission("product", team, product);
}

export function removeTeamProductPermission(team: ITeam, product: IProduct) {
  return removeTeamPermission("product", team, product);
}

export function grantTeamTopicPermission(team: ITeam, topic: ITopic) {
  return grantTeamPermission("topic", team, topic);
}

export function removeTeamTopicPermission(team: ITeam, topic: ITopic) {
  return removeTeamPermission("topic", team, topic);
}
