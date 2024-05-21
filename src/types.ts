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

export type dataField = {
  [x: string]: any;
};

export interface ITeam extends Resource {
  country: string | null;
  external: boolean;
  has_pre_release_access: boolean;
  state: state;
  created_at: string;
  updated_at: string;
  remotecis: IRemoteci[];
  topics: ITopic[];
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

export interface IProductsById {
  [id: string]: IProduct;
}

export interface IEnhancedProduct extends IProduct {
  from_now: string | null;
}

export interface IRemoteci extends Resource {
  team_id: string;
  state: string;
  data: dataField;
  public: boolean;
  api_secret: string;
  created_at: string;
  updated_at: string;
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
  data: dataField;
  state: state;
  created_at: string;
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
  data: dataField;
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

export type IJobStatus = (typeof JobStatuses)[number];

export const FinalJobStatuses = ["success", "failure", "error", "killed"];

export type IFinalJobStatuses = (typeof FinalJobStatuses)[number];

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
  query: string | null;
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

export interface IIdentityTeam {
  has_pre_release_access: boolean;
  id: string;
  name: string;
}

export interface IIdentity {
  email: string | null;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: {
    [id: string]: IIdentityTeam;
  };
  timezone: string;
}

export interface ICurrentUser {
  email: string | null;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: IIdentityTeam[];
  team: IIdentityTeam | null;
  timezone: string;
  isSuperAdmin: boolean;
  hasEPMRole: boolean;
  hasReadOnlyRole: boolean;
  isReadOnly: boolean;
}

export type ICurrentUserWithPasswordsFields = ICurrentUser & {
  current_password: string;
  new_password: string;
};

export type DCIListParams = {
  limit: number;
  offset: number;
  where?: string;
  sort?: string;
  query?: string;
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

export type ITestCaseActionType = "success" | "skipped" | "failure" | "error";

export interface ITestCase {
  action: ITestCaseActionType;
  classname: string;
  message: string | null;
  name: string;
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
  properties: { name: string; value: string }[];
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
  | "success"
  | "withAWarning";
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

export interface IPipeline extends Resource {}

export interface IKeyValue {
  key: string;
  value: number;
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
  pipeline: IPipeline | null;
  keys_values: IKeyValue[];
}

export interface IEnhancedJob extends IJob {
  jobstates: IJobState[];
  tests: ITest[];
  files: IFile[];
}

export interface JobNode extends IJob {
  children: JobNode[];
  index: number;
}

export interface IJobsById {
  [id: string]: IJob;
}

export interface IComponent {
  id: string;
  etag: string;
  display_name: string;
  version: string;
  uid: string;
  data: dataField;
  state: string;
  tags: string[];
  team_id: string | null;
  topic_id: string;
  type: string;
  url: string;
  created_at: string;
  updated_at: string;
  released_at: string;
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

export interface DCIError {
  message?: string;
  payload?: {
    error?: { k: string };
    errors?: string[] | { k: string };
  };
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
      display_name: string;
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
  "pipeline",
  "config",
  "team",
  "remoteci",
  "topic",
  "component",
  "components",
  "tests",
  "tags",
  "keysValues",
  "created_at",
  "duration",
  "started",
] as const;
export type JobsTableListColumn = (typeof JobsTableListColumns)[number];

export interface IComponentCoverage {
  id: string;
  display_name: string;
  type: string;
  nbOfSuccessfulJobs: number;
  nbOfJobs: number;
  topic_id: string;
  jobs: { id: string; created_at: string; status: IJobStatus; name: string }[];
  tags: string[];
}

export interface IPipelines {
  components_headers: string[];
  days: {
    date: string;
    pipelines: {
      name: string;
      created_at: string;
      jobs: {
        client_version: string;
        comment: string | null;
        configuration: string;
        created_at: string;
        duration: number;
        etag: string;
        id: string;
        name: string;
        pipeline: { [k: string]: any };
        pipeline_id: string;
        previous_job_id: string | null;
        product_id: string;
        remoteci_id: string;
        state: string;
        status: IJobStatus;
        status_reason: string | null;
        tags: string[];
        team_id: string;
        topic_id: string;
        update_previous_job_id: string | null;
        updated_at: string;
        url: string | null;
        user_agent: string;
        tests: {
          errors: number;
          failures: number;
          success: number;
          skips: number;
          total: number;
        };
        components: (IComponent | null)[];
      }[];
    }[];
  }[];
}

export type RangeOptionValue =
  | "previousWeek"
  | "previousMonth"
  | "previousQuarter"
  | "lastMonth"
  | "lastYear"
  | "yesterday"
  | "today"
  | "currentWeek"
  | "currentMonth"
  | "currentQuarter"
  | "currentYear"
  | "last7Days"
  | "last30Days"
  | "last90Days"
  | "last365Days"
  | "custom";

export type colorTheme = "dark" | "light";

interface BaseListResponse {
  _meta: {
    count: number;
  };
}

export interface ComponentListResponse extends BaseListResponse {
  components: IComponent[];
}

export interface RemoteciListResponse extends BaseListResponse {
  remotecis: IRemoteci[];
}

export interface Filters {
  limit: number;
  offset: number;
  sort: string;
  query: string | null;
  name: string | null;
  sso_username: string | null;
  display_name: string | null;
  team_id: string | null;
  pipeline_id: string | null;
  email: string | null;
  remoteci_id: string | null;
  product_id: string | null;
  topic_id: string | null;
  tags: string[] | undefined;
  configuration: string | null;
  status: string | null;
  type: string | null;
  state: state;
}

export type WhereFilters = Pick<
  Filters,
  | "name"
  | "display_name"
  | "team_id"
  | "pipeline_id"
  | "email"
  | "sso_username"
  | "remoteci_id"
  | "product_id"
  | "topic_id"
  | "configuration"
  | "status"
  | "tags"
  | "state"
  | "type"
>;

export interface SelectProps<T> {
  id: string | null;
  onSelect: (item: T) => void;
  onClear: () => void;
  placeholder?: string;
  showToolbarItem?: boolean;
}
