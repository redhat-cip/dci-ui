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
}

type data = {
  [x: string]: any;
};

export interface ITeam extends Resource {
  country: string | null;
  external: boolean;
  state: state;
  created_at: string;
  updated_at: string;
  remotecis: IRemoteci[];
  topics: ITopic[];
}

export interface INewTeam {
  name: string;
  external: boolean;
  state: string;
}

export interface ITeamsById {
  [id: string]: ITeam;
}
export interface IEnhancedTeam extends ITeam {
  from_now: string | null;
}

export interface IProduct extends Resource {
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface INewProduct {
  name: string;
  description: string;
}

export interface IEditProduct {
  id: string;
  etag: string;
  name: string;
  description: string;
}

export interface IProductWithTeams extends IProduct {
  teams: ITeam[];
}

export interface IProductsById {
  [id: string]: IProduct;
}
export interface IEnhancedProduct extends IProduct {
  from_now: string | null;
}

export interface IRemoteci extends Resource {
  team_id: string;
  state: string;
  data: data;
  public: boolean;
  cert_fp: string | null;
  api_secret: string;
  created_at: string;
  updated_at: string;
}

export interface INewRemoteci {
  name: string;
  team_id: string;
}

export interface IEditRemoteci {
  id: string;
  etag: string;
  name: string;
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
  created_at: string;
  updated_at: string;
  export_control: boolean;
  product_id: string;
  next_topic_id: string | null;
}

export interface INewTopic {
  name: string;
  export_control: boolean;
  state: string;
  product_id: string | null;
  component_types: string[];
  data: data;
}

export interface IEditTopic {
  id: string;
  etag: string;
  name: string;
  export_control: boolean;
  state: string;
  product_id: string | null;
  component_types: string[];
  data: data;
}

export interface ITopicForm {
  name: string;
  export_control: boolean;
  state: string;
  product_id: string;
  component_types: string;
  data: string;
}

export interface ITopicsById {
  [id: string]: ITopic;
}
export interface IEnhancedTopic extends ITopic {
  product: IProduct | null;
  from_now: string | null;
}

export interface ITopicWithTeams extends ITopic {
  teams: ITeam[];
}

export interface IUser extends Resource {
  email: string;
  fullname: string;
  sso_username: string;
  state: state;
  timezone: string;
  created_at: string;
  updated_at: string;
  password: string;
}

export interface INewUser {
  name: string;
  fullname: string;
  email: string;
  password: string;
}

export interface IUsersById {
  [id: string]: IUser;
}
export interface IEnhancedUser extends IUser {
  from_now: string | null;
}

export interface IFeeder extends Resource {
  team_id: string;
  created_at: string;
  updated_at: string;
  api_secret: string;
  data: data;
  state: string;
}
export interface IFeedersById {
  [id: string]: IFeeder;
}
export interface IEnhancedFeeder extends IFeeder {
  team: ITeam;
  from_now: string | null;
}

export const JobStatuses = [
  "success",
  "failure",
  "error",
  "killed",
  "new",
  "running",
  "pre-run",
  "post-run",
] as const;

export type IJobStatus = typeof JobStatuses[number];

export const FinalJobStatuses = ["success", "failure", "error", "killed"];

export type IFinalJobStatuses = typeof FinalJobStatuses[number];

export interface IPaginationFilters {
  page: number;
  perPage: number;
}

export interface IJobFilters extends IPaginationFilters {
  team_id: string | null;
  product_id: string | null;
  topic_id: string | null;
  remoteci_id: string | null;
  configuration: string | null;
  tags: string[];
  status: IJobStatus | null;
  name: string | null;
}

export interface IUserFilters extends IPaginationFilters {
  email: string | null;
  sort?: string;
}

export type PatternflyFilters = {
  teams: string[];
  products: string[];
  topics: string[];
  remotecis: string[];
  tags: string[];
  status: IJobStatus[];
  page: number;
  perPage: number;
};

export interface IIdentity {
  email: string;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: {
    [id: string]: ITeam;
  };
  timezone: string;
}

export interface ICurrentUser {
  email: string;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: ITeam[];
  team: ITeam | null;
  timezone: string;
  isSuperAdmin: boolean;
  hasEPMRole: boolean;
  hasReadOnlyRole: boolean;
  isReadOnly: boolean;
}

export type DCIListParams = {
  limit: number;
  offset: number;
  where?: string;
  sort?: string;
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
  stdout: string | null;
  stderr: string | null;
  properties: { name: string; value: string }[];
}

export interface IGetTestsCases {
  testscases: ITestsCase[];
}

export type ITestCaseActionType = "success" | "skipped" | "failure" | "error";

export interface ITestCase {
  action: ITestCaseActionType;
  classname: string;
  message: string | null;
  name: string;
  properties: { name: string; value: string }[];
  stderr: string | null;
  stdout: string | null;
  time: number;
  type: string;
  value: string;
  successfix: boolean;
  regression: boolean;
}

export interface ITestSuite {
  errors: number;
  failures: number;
  id: number;
  name: string;
  skipped: number;
  success: number;
  successfixes: number;
  regressions: number;
  testcases: ITestCase[];
  tests: number;
  time: number;
}

export interface IGetJunitTestSuites {
  testsuites: ITestSuite[];
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

export type IPipelineStatus =
  | "success"
  | "info"
  | "pending"
  | "warning"
  | "danger";

export type IFileStatus =
  | "failed"
  | "unreachable"
  | "skipped"
  | "ignored"
  | "success";
export interface IJobState {
  id: string;
  status: IJobStatus;
  pipelineStatus?: IPipelineStatus;
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

export interface IResult {
  created_at: string;
  id: string;
  job_id: string;
  updated_at: string;
  errors: number;
  failures: number;
  file_id: string;
  name: string;
  regressions: number;
  skips: number;
  success: number;
  successfixes: number;
  time: number;
  total: number;
}

export interface IJob extends Resource {
  client_version: string | null;
  comment: string | null;
  components: IComponent[];
  configuration: string | null;
  duration: number;
  previous_job_id: string | null;
  product_id: string;
  remoteci: IRemoteci;
  remoteci_id: string;
  results: IResult[];
  state: string;
  status: IJobStatus;
  status_reason: string | null;
  tags: string[] | null;
  team: ITeam;
  team_id: string;
  topic: ITopic;
  topic_id: string;
  update_previous_job_id: string | null;
  created_at: string;
  updated_at: string;
  url: string | null;
  user_agent: string;
}

export interface IEnhancedJob extends IJob {
  jobstates: IJobState[];
  tests: ITest[];
  files: IFile[];
}

export interface IJobsById {
  [id: string]: IJob;
}

export interface IComponent extends Resource {
  canonical_project_name: string | null;
  data: data;
  message: string | null;
  released_at: string;
  state: string;
  tags: string[] | null;
  team_id: string | null;
  title: string | null;
  topic_id: string;
  type: string;
  created_at: string;
  updated_at: string;
  url: string | null;
}

export interface IEmbedJob {
  id: string;
  etag: string;
  data: string;
  client_version: string | null;
  comment: string | null;
  duration: number;
  previous_job_id: string | null;
  product_id: string;
  remoteci_id: string;
  state: string;
  status: IJobStatus;
  tags: string[] | null;
  team_id: string;
  topic_id: string;
  update_previous_job_id: string | null;
  created_at: string;
  updated_at: string;
  user_agent: string;
}

export interface IComponentWithJobs extends IComponent {
  jobs: IJob[];
}

export interface IAlert {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "danger";
}

export interface IToken {
  type: "Bearer" | "Basic";
  value: string;
}

export interface IAlertsState {
  [x: string]: IAlert;
}

export interface IApiState {
  byId: { [x: string]: any };
  allIds: string[];
  isFetching: boolean;
  count: number;
}

export interface IDataFromES {
  total: {
    value: number;
    relation: string;
  };
  max_score: number | null;
  hits: {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: {
      job_id: string;
      job_name: string;
      job_status: IJobStatus;
      created_at: string;
      topic_id: string;
      remoteci_id: string;
      data: {
        name: string;
        duration: number;
      }[];
    };
  }[];
}

export interface IGraphData {
  id: string;
  name: string;
  status: string;
  created_at: string;
  data: { name: string; x: number; y: number }[];
}

export interface IRefArea {
  left: number | null;
  right: number | null;
}

export interface IComponentCoverageESData {
  total: {
    value: number;
    relation: string;
  };
  max_score: number | null;
  hits: {
    _id: string;
    _index: string;
    _score: number;
    _source: {
      id: string;
      name: string;
      canonical_project_name: string;
      failed_jobs: {
        created_at: string;
        id: string;
        name: string;
      }[];
      product_id: string;
      success_jobs: {
        created_at: string;
        id: string;
        name: string;
      }[];
      tags: string[];
      team_id: string | null;
      topic_id: string;
      type: string;
    };
    _type: string;
  }[];
}

const JobsTableListColumns = [
  "id",
  "name",
  "config",
  "team",
  "remoteci",
  "topic",
  "component",
  "components",
  "tests",
  "tags",
  "created_at",
  "duration",
  "started",
] as const;
export type JobsTableListColumn = typeof JobsTableListColumns[number];
