export interface IConfig {
  apiURL: string;
  sso: {
    url: string;
    realm: string;
    clientId: string;
  };
}

export interface Team {
  id: string;
  name: string;
}

export type Product = {
  id: string;
  name: string;
};

export type Remoteci = {
  id: string;
  name: string;
};

export type Topic = {
  id: string;
  name: string;
};

export const Statuses = [
  "success",
  "failure",
  "error",
  "killed",
  "new",
  "running",
  "pre-run",
  "post-run",
] as const;

export type Status = typeof Statuses[number];

export type Filters = {
  team_id: string | null;
  product_id: string | null;
  topic_id: string | null;
  remoteci_id: string | null;
  tags: string[];
  status: Status | null;
  page: number;
  perPage: number;
};

export type PatternflyFilters = {
  teams: string[];
  products: string[];
  topics: string[];
  remotecis: string[];
  tags: string[];
  status: Status[];
  page: number;
  perPage: number;
};

export interface Identity {
  email: string;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: {
    [id: string]: Team;
  };
  timezone: string;
  isSuperAdmin?: boolean;
  hasEPMRole?: boolean;
  hasReadOnlyRole?: boolean;
  isReadOnly?: boolean;
  team?: Team;
}

export type DCIListParams = {
  embed?: string;
  limit?: number;
  offset?: number;
  where?: string;
};

export type StatJob = {
  created_at: string;
  id: string;
  remoteci_name: string;
  status: string;
  team_name: string;
};

export type Stat = {
  jobs: StatJob[];
  percentageOfSuccess: number;
  nbOfSuccessfulJobs: number;
  nbOfJobs: number;
  product: Product;
  topic: Topic;
};

export interface ITest {
  errors: number;
  failures: number;
  file_id: string;
  filename: string;
  name: string;
  regressions: number;
  skips: number;
  success: number;
  successfixes: number;
  time: number;
  total: number;
}

export type TestCaseActionType = "passed" | "skipped" | "failure" | "error";

export interface ITestsCase {
  action: TestCaseActionType;
  classname: string;
  message: string;
  name: string;
  regression: boolean;
  successfix: boolean;
  time: number;
  type: string;
  value: string;
}

export type state = "active" | "inactive" | "archived";

export interface IJob {
  client_version: string;
  comment: string | null;
  created_at: string;
  duration: number;
  etag: string;
  id: string;
  previous_job_id: string | null;
  product_id: string;
  remoteci_id: string;
  state: state;
  status: Status;
  tags: string[];
  team_id: string;
  topic_id: string;
  update_previous_job_id: string | null;
  updated_at: string;
  user_agent: string;
}

export interface IComponent {
  id: string;
  etag: string;
  name: string;
  type: string;
  tags: string[] | null;
}
