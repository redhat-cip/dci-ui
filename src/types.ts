export type Team = {
  id: string;
  name: string;
};

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

export type Identity = {
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
} | null;

export type DCIListParams = {
  embed?: string;
  limit?: number;
  offset?: number;
  where?: string;
};

export type State = {
  config: {
    apiURL: string;
    sso: {
      url: string;
      realm: string;
      clientId: string;
    };
  };
};

type StatJob = {
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
