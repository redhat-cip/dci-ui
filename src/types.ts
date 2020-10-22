export type IResourceName =
  | "jobstate"
  | "team"
  | "remoteci"
  | "user"
  | "product"
  | "topic"
  | "feeder"
  | "job";

export type IResourcesName =
  | IResourceName
  | "jobstates"
  | "teams"
  | "remotecis"
  | "users"
  | "products"
  | "topics"
  | "feeders"
  | "jobs";

export interface Resource {
  id: string;
  etag: string;
  name: string;
  created_at: string;
}

type data = {
  [x: string]: any;
};

export interface IConfig {
  apiURL: string;
  sso: {
    url: string;
    realm: string;
    clientId: string;
  };
}

export interface ITeam extends Resource {
  parent_id: string;
}
export interface ITeamsById {
  [id: string]: ITeam;
}
export interface IEnhancedTeam extends ITeam {
  from_now: string | null;
}

export interface IProduct extends Resource {}
export interface IProductsById {
  [id: string]: IProduct;
}
export interface IEnhancedProduct extends IProduct {
  from_now: string | null;
}

export interface IRemoteci extends Resource {
  team_id: string;
}
export interface IRemotecisById {
  [id: string]: IRemoteci;
}
export interface IEnhancedRemoteci extends IRemoteci {
  team: ITeam | null;
  from_now: string | null;
}

export interface ITopic extends Resource {
  component_types: string[];
  data: data;
  state: string;
  updated_at: string;
  export_control: boolean;
  product_id: string;
  next_topic_id: string | null;
}
export interface ITopicsById {
  [id: string]: ITopic;
}
export interface IEnhancedTopic extends ITopic {
  product: IProduct | null;
  next_topic: ITopic | null;
  from_now: string | null;
}

export interface IUser extends Resource {
  email: string;
  fullname: string;
  sso_username: string;
  state: state;
  timezone: string;
  updated_at: string;
}
export interface IUsersById {
  [id: string]: IUser;
}
export interface IEnhancedUser extends IUser {
  from_now: string | null;
}

export interface IFeeder extends Resource {
  team_id: string;
}
export interface IFeedersById {
  [id: string]: IFeeder;
}
export interface IEnhancedFeeder extends IFeeder {
  from_now: string | null;
}

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

export interface IPaginationFilters {
  page: number;
  perPage: number;
}

export interface IJobFilters extends IPaginationFilters {
  team_id: string | null;
  product_id: string | null;
  topic_id: string | null;
  remoteci_id: string | null;
  tags: string[];
  status: Status | null;
}

export interface IUserFilters extends IPaginationFilters {
  email: string | null;
}

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

export interface ICurrentUser {
  email: string;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: {
    [id: string]: ITeam;
  };
  timezone: string;
  isSuperAdmin?: boolean;
  hasEPMRole?: boolean;
  hasReadOnlyRole?: boolean;
  isReadOnly?: boolean;
  team?: ITeam;
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

export type IStat = {
  jobs: StatJob[];
  percentageOfSuccess: number;
  nbOfSuccessfulJobs: number;
  nbOfJobs: number;
  product: IProduct;
  topic: ITopic;
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

export interface IGetTestsResults {
  results: ITest[];
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

export interface IGetTestsCases {
  testscases: ITestsCase[];
}

export type state = "active" | "inactive" | "archived";

export interface IFile {
  id: string;
  etag: string;
  created_at: string;
  updated_at: string;
  job_id: string;
  jobstate_id: string | null;
  md5: string | null;
  mime: string | null;
  name: string;
  size: number;
  state: state;
  team_id: string;
  test_id: string | null;
}

export interface IFileWithDuration extends IFile {
  duration: number;
}

export interface IJobState {
  id: string;
  status: Status;
  files: IFile[];
  comment: string;
  created_at: string;
  job_id: string;
}

export interface IGetJobStates {
  jobstates: IJobState[];
}

export interface IJobStateWithDuration extends IJobState {
  duration: number;
  files: IFileWithDuration[];
}

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

export interface IEnhancedJob extends IJob {
  jobstates: IJobState[];
  tests: ITest[];
  files: IFile[];
}

export interface IComponent extends Resource {
  type: string;
  tags: string[] | null;
}

export interface PerformanceTestsCases {
  classname: string;
  delta: number;
  name: string;
  time: number;
}

export interface PerformanceData {
  job_id: string;
  testscases: PerformanceTestsCases[];
}

export interface TestPerformance {
  [testName: string]: PerformanceData[];
}

export type IPerformance = TestPerformance[];
