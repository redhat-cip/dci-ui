import { schema } from "normalizr";
import { IResourcesName } from "types";

export function getSchema(resource: IResourcesName) {
  const jobstate = new schema.Entity("jobstates");
  const jobstates = [jobstate];
  const team = new schema.Entity("teams");
  const teams = [team];
  const remoteci = new schema.Entity("remotecis", { team: team });
  const remotecis = [remoteci];
  const user = new schema.Entity("users", {
    team: team,
    remotecis: [remoteci],
  });
  const users = [user];
  const product = new schema.Entity("products", { team: team });
  const products = [product];
  const topic = new schema.Entity("topics", { product: product });
  const topics = [topic];
  const feeder = new schema.Entity("feeders", { team: team });
  const feeders = [feeder];
  const job = new schema.Entity("jobs", {
    jobstates: [jobstate],
    remoteci: remoteci,
    topic: topic,
  });
  const jobs = [job];
  const schemas: {
    [schemaName in IResourcesName]: schema.Entity | schema.Entity[];
  } = {
    jobstate,
    jobstates,
    team,
    teams,
    remoteci,
    remotecis,
    user,
    users,
    product,
    products,
    topic,
    topics,
    feeder,
    feeders,
    job,
    jobs,
  };
  return schemas[resource];
}
