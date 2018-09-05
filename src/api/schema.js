import { schema } from "normalizr";

export const component = new schema.Entity("components");
export const components = [component];

export const jobstate = new schema.Entity("jobstates");
export const jobstates = [jobstate];

export const remoteci = new schema.Entity("remotecis");
export const remotecis = [remoteci];

export const role = new schema.Entity("roles");
export const roles = [role];

export const team = new schema.Entity("teams");
export const teams = [team];

export const user = new schema.Entity("users", {
  team: team,
  role: role,
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
  components: [component],
  jobstates: [jobstate],
  remoteci: remoteci,
  topic: topic
});
export const jobs = [job];
