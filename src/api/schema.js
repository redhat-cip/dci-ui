import { schema } from "normalizr";

export const jobstate = new schema.Entity("jobstates");
export const jobstates = [jobstate];

export const team = new schema.Entity("teams");
export const teams = [team];

export const remoteci = new schema.Entity("remotecis", {
  team: team
});
export const remotecis = [remoteci];

export const user = new schema.Entity("users", {
  team: team,
  remotecis: [remoteci]
});
export const users = [user];

export const product = new schema.Entity("products", {
  team: team
});
export const products = [product];

export const topic = new schema.Entity("topics", {
  product: product
});
export const topics = [topic];

export const job = new schema.Entity("jobs", {
  jobstates: [jobstate],
  remoteci: remoteci,
  topic: topic
});
export const jobs = [job];
