import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  injectGetEndpoint,
} from "../api";
import { IFeeder } from "types";

const resource = "Feeder";

export const { useCreateFeederMutation } =
  injectCreateEndpoint<IFeeder>(resource);
export const { useGetFeederQuery } = injectGetEndpoint<IFeeder>(resource);
export const { useDeleteFeederMutation } =
  injectDeleteEndpoint<IFeeder>(resource);
export const { useListFeedersQuery } = injectListEndpoint<IFeeder>(resource);
export const { useUpdateFeederMutation } =
  injectUpdateEndpoint<IFeeder>(resource);
