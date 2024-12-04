import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  injectGetEndpoint,
  api,
} from "api";
import type { IProduct, ITeam, IGetProducts, IGetTeams } from "../types";

const resource = "Team";

export const { useCreateTeamMutation } = injectCreateEndpoint<ITeam>(resource);
export const { useGetTeamQuery } = injectGetEndpoint<ITeam>(resource);
export const { useDeleteTeamMutation } = injectDeleteEndpoint<ITeam>(resource);
export const { useListTeamsQuery } = injectListEndpoint<ITeam>(resource);
export const { useUpdateTeamMutation } = injectUpdateEndpoint<ITeam>(resource);

export const {
  useAddProductToTeamMutation,
  useRemoveProductFromTeamMutation,
  useGetProductIdsTeamHasAccessToQuery,
} = api
  .enhanceEndpoints({ addTagTypes: ["TeamProductPermissions"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getProductIdsTeamHasAccessTo: builder.query<string[], string>({
        query: (id) => `/teams/${id}/products`,
        transformResponse: (response: IGetProducts) =>
          response.products.map((p) => p.id),
        providesTags: [{ type: "TeamProductPermissions", id: "LIST" }],
      }),
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
        invalidatesTags: [{ type: "TeamProductPermissions", id: "LIST" }],
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
        invalidatesTags: [{ type: "TeamProductPermissions", id: "LIST" }],
      }),
    }),
  });

export const {
  useAddTeamPermissionForTeamMutation,
  useRemoveTeamPermissionForTeamMutation,
  useGetComponentsPermissionsQuery,
} = api
  .enhanceEndpoints({ addTagTypes: ["TeamComponentPermissions"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getComponentsPermissions: builder.query<ITeam[], string>({
        query: (id) => `/teams/${id}/permissions/components`,
        transformResponse: (response: IGetTeams) => response.teams,
        providesTags: [{ type: "TeamComponentPermissions", id: "LIST" }],
      }),
      addTeamPermissionForTeam: builder.mutation<
        void,
        { remoteTeam: ITeam; team: ITeam }
      >({
        query({ remoteTeam, team }) {
          return {
            url: `/teams/${team.id}/permissions/components`,
            method: "POST",
            body: { teams_ids: [remoteTeam.id] },
          };
        },
        invalidatesTags: [{ type: "TeamComponentPermissions", id: "LIST" }],
      }),
      removeTeamPermissionForTeam: builder.mutation<
        void,
        { remoteTeam: ITeam; team: ITeam }
      >({
        query({ remoteTeam, team }) {
          return {
            url: `/teams/${team.id}/permissions/components`,
            method: "DELETE",
            body: { teams_ids: [remoteTeam.id] },
          };
        },
        invalidatesTags: [{ type: "TeamComponentPermissions", id: "LIST" }],
      }),
    }),
  });
