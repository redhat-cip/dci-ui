interface Resource {
  id: string;
  etag: string;
  name: string;
}

type dataField = {
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

export interface IGetTeams extends BaseListResponse {
  teams: ITeam[];
}

export interface IProduct extends Resource {
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IGetProducts extends BaseListResponse {
  products: IProduct[];
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

export interface ITopic extends Resource {
  component_types: string[];
  component_types_optional: string[];
  data: dataField;
  state: state;
  created_at: string;
  updated_at: string;
  export_control: boolean;
  product_id: string;
  next_topic_id: string | null;
  product: IProduct;
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

export interface IGetUsers extends BaseListResponse {
  users: IUser[];
}

export interface IFeeder extends Resource {
  team_id: string;
  created_at: string;
  updated_at: string;
  api_secret: string;
  data: dataField;
  state: state;
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

export const FinalJobStatuses = [
  "success",
  "failure",
  "error",
  "killed",
] as const;

export type IFinalJobStatus = (typeof FinalJobStatuses)[number];

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
export type ITestCaseActionState =
  | "RECOVERED"
  | "REGRESSED"
  | "UNCHANGED"
  | "REMOVED"
  | "ADDED";

export interface ITestCase {
  action: ITestCaseActionType;
  state: ITestCaseActionState;
  classname: string;
  message: string | null;
  name: string;
  stderr: string | null;
  stdout: string | null;
  time: number;
  type: string;
  value: string;
}

interface ITestSuite {
  additions: number;
  deletions: number;
  unchanged: number;
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
  job: {
    id: string;
    name: string;
  };
  previous_job: {
    id: string;
    name: string;
  } | null;
  testsuites: ITestSuite[];
}

export type state = "active" | "inactive" | "archived";

export interface IFile extends Resource {
  created_at: string;
  updated_at: string;
  job_id: string;
  jobstate_id: string | null;
  md5: string | null;
  mime: string | null;
  size: number;
  state: state;
  team_id: string;
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

export interface IPipeline extends Resource {
  created_at: string;
  updated_at: string;
  state: state;
  team_id: string;
}

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

export const TimeRanges = [
  "previousWeek",
  "previousMonth",
  "previousQuarter",
  "lastMonth",
  "lastYear",
  "yesterday",
  "today",
  "currentWeek",
  "currentMonth",
  "currentQuarter",
  "currentYear",
  "last7Days",
  "last30Days",
  "last90Days",
  "last365Days",
  "custom",
] as const;
export type TimeRange = (typeof TimeRanges)[number];

export interface AnalyticsToolbarSearch {
  query: string;
  range: TimeRange;
  after: string;
  before: string;
}

export type AnalyticsToolbarSearches = Record<string, AnalyticsToolbarSearch>;

export type colorTheme = "dark" | "light";

interface BaseListResponse {
  _meta: {
    count: number;
  };
}

export interface IGetComponents extends BaseListResponse {
  components: IComponent[];
}

export interface IGetRemotecis extends BaseListResponse {
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

export interface IToolbarFilterProps<T> {
  id: string | null;
  onSelect: (item: T) => void;
  onClear: () => void;
  placeholder?: string;
  showToolbarItem?: boolean;
}

interface IAnalyticsKeyValue {
  job_id: string;
  key: string;
  value: number;
}

export interface IAnalyticsJob {
  id: string;
  name: string;
  status: IJobStatus;
  status_reason: string | null;
  keys_values: IAnalyticsKeyValue[];
  created_at: string;
  url: string;
  components: {
    id: string;
    topic_id: string;
    display_name: string;
    type: string;
  }[];
  comment: string | null;
  configuration: string | null;
  team: {
    id: string;
    name: string;
  };
  topic: {
    name: string;
  };
  remoteci: {
    name: string;
  };
  results?: {
    errors: number;
    failures: number;
    success: number;
    skips: number;
    total: number;
  }[];
  pipeline: {
    id: string;
    created_at: string;
    name: string;
  } | null;
  duration: number;
  tags: string[];
}

export interface IGetAnalyticsJobsResponse {
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  hits: {
    hits: {
      _id: string;
      _index: string;
      _score: number | null;
      _source: IAnalyticsJob;
      _type: string;
      sort: string[];
    }[];
    max_score: number | null;
    total: {
      relation: string;
      value: number;
    };
  };
  timed_out: boolean;
  took: number;
}

export type IGetAnalyticsJobsEmptyResponse = Record<string, never>;

export interface FormGroupProps {
  id: string;
  label: string;
  name: string;
  isRequired?: boolean;
  placeholder?: string;
  [key: string]: any;
}

export const groupByKeys = [
  "topic",
  "pipeline",
  "component",
  "name",
  "remoteci",
  "team",
  "configuration",
  "comment",
  "url",
  "status",
  "status_reason",
] as const;

export type IGroupByKey = (typeof groupByKeys)[number];

export const groupByKeysWithLabel: Record<IGroupByKey, string> = {
  topic: "Topic name",
  pipeline: "Pipeline name",
  component: "Component name",
  name: "Job name",
  team: "Team name",
  remoteci: "Remoteci name",
  configuration: "Configuration",
  comment: "Comments",
  url: "URL",
  status: "Status",
  status_reason: "Status reason",
};
