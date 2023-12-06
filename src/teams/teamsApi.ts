import http from "services/http";
import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  injectGetEndpoint,
  Api,
} from "../api";
import type { IProduct, ITeam, IUser } from "../types";
import { AxiosPromise } from "axios";

const resource = "Team";

export const { useCreateTeamMutation } = injectCreateEndpoint<ITeam>(resource);
export const { useGetTeamQuery } = injectGetEndpoint<ITeam>(resource);
export const { useDeleteTeamMutation } = injectDeleteEndpoint<ITeam>(resource);
export const { useListTeamsQuery } = injectListEndpoint<ITeam>(resource);
export const { useUpdateTeamMutation } = injectUpdateEndpoint<ITeam>(resource);

export function searchTeam(name: string): AxiosPromise<{
  teams: ITeam[];
}> {
  return http.get(`/api/v1/teams/?where=name:${name}`);
}

export function getOrCreateTeam(team: Partial<ITeam>) {
  return searchTeam(team.name || "").then((response) => {
    if (response.data.teams.length > 0) {
      return response.data.teams[0];
    } else {
      return http({
        method: "post",
        url: `/api/v1/teams`,
        data: team,
      }).then((response) => response.data.team as ITeam);
    }
  });
}

export const { useAddProductToTeamMutation, useRemoveProductFromTeamMutation } =
  Api.enhanceEndpoints({
    addTagTypes: ["Team"],
  }).injectEndpoints({
    endpoints: (builder) => ({
      addProductToTeam: builder.mutation<
        void,
        { product: IProduct; team: ITeam }
      >({
        query({ product, team }) {
          return {
            url: `/products/${product.id}/teams`,
            method: "POST",
            body: { team_id: team.id },
          };
        },
        invalidatesTags: [{ type: "Team", id: "LIST" }],
      }),
      removeProductFromTeam: builder.mutation<
        { success: boolean; id: string },
        { product: IProduct; team: ITeam }
      >({
        query({ product, team }) {
          return {
            url: `/products/${product.id}/teams/${team.id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: [{ type: "Team", id: "LIST" }],
      }),
    }),
  });

export function getProductsTeamHasAccessTo(
  team: ITeam,
  products: IProduct[],
): Promise<IProduct[]> {
  const promises = products.map((product) =>
    http.get(`/api/v1/products/${product.id}/teams`),
  );
  const productsTeamHasAccessTo: IProduct[] = [];
  return Promise.all(promises).then((responses) => {
    responses.forEach((response, index) => {
      if (response.data.teams.map((t: ITeam) => t.id).includes(team.id)) {
        productsTeamHasAccessTo.push({ ...products[index] });
      }
    });
    return Promise.resolve(productsTeamHasAccessTo);
  });
}

export function getComponentsPermissions(team: ITeam): Promise<ITeam[]> {
  return http
    .get(`/api/v1/teams/${team.id}/permissions/components`)
    .then((response) => response.data.teams);
}

export function addRemoteTeamPermissionForTheTeam(
  remoteTeam: ITeam,
  team: ITeam,
): AxiosPromise<void> {
  return http({
    method: "post",
    url: `/api/v1/teams/${team.id}/permissions/components`,
    data: { teams_ids: [remoteTeam.id] },
  });
}

export function removeRemoteTeamPermissionForTheTeam(
  remoteTeam: ITeam,
  team: ITeam,
): AxiosPromise<void> {
  return http({
    method: "delete",
    url: `/api/v1/teams/${team.id}/permissions/components`,
    data: { teams_ids: [remoteTeam.id] },
  });
}

export function fetchUsersForTeam(team: ITeam): Promise<IUser[]> {
  return http
    .get(`/api/v1/teams/${team.id}/users`)
    .then((response) => response.data.users);
}
