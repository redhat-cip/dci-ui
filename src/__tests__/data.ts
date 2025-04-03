import { buildCurrentUser } from "auth/authApi";
import {
  IComponent,
  IFeeder,
  IIdentityTeam,
  IProduct,
  IRemoteci,
  ITeam,
  ITopic,
  IUser,
} from "types";

export const teams: ITeam[] = [
  {
    created_at: "2024-10-24T09:22:08.805377+00:00",
    name: "Red Hat",
    etag: "00a046ea59f74e04add744a87412b033",
    id: "8ca1e85b-7b5f-4563-a430-f4095bebbda0",
    updated_at: "2024-10-24T09:22:08.805395+00:00",
    country: null,
    external: false,
    has_pre_release_access: true,
    state: "active",
    remotecis: [],
    topics: [],
  },
  {
    created_at: "2024-10-24T09:22:08.805450+00:00",
    name: "DCI",
    etag: "a3ed3ab4a96740a2a2e527182a32e283",
    id: "cc5947c7-bcc9-4a02-8353-45ef9bc49817",
    updated_at: "2024-10-24T09:22:08.805455+00:00",
    country: null,
    external: false,
    has_pre_release_access: true,
    state: "active",
    remotecis: [],
    topics: [],
  },
];

export const identity = {
  email: "u1@redhat.com",
  etag: "191539996cb96d416cd386558de5d499",
  fullname: "First User",
  id: "a48ecab4-01d0-97d9-4f45-f7b938808e23",
  name: "u1",
  teams: {
    "e5147a96-7c76-4415-b01e-edefba96a9c8": {
      has_pre_release_access: false,
      id: "e5147a96-7c76-4415-b01e-edefba96a9c8",
      name: "First Team",
    } as IIdentityTeam,
  },
  timezone: "Europe/Paris",
};

export const users: IUser[] = [
  {
    email: "u1@redhat.com",
    etag: "191539996cb96d416cd386558de5d499",
    fullname: "First User",
    id: "u1",
    name: "u1",
    state: "active",
    sso_username: "u1",
    created_at: "2024-10-24T09:22:08.805450+00:00",
    updated_at: "2024-10-24T09:22:08.805455+00:00",
    timezone: "UTC",
    password: "",
  },
  {
    email: "u2@redhat.com",
    etag: "9996cb96d416cd386558de5d49919153",
    fullname: "Second User",
    id: "u2",
    name: "u2",
    state: "active",
    sso_username: "u2",
    created_at: "2024-10-25T10:32:17.548051+00:00",
    updated_at: "2024-10-25T10:32:17.548051+00:00",
    timezone: "UTC",
    password: "",
  },
];

export const currentUser = buildCurrentUser(identity, null);

export const products: IProduct[] = [
  {
    created_at: "2019-12-04T15:58:21.528598",
    description: "OpenShift is an open source container application platform",
    etag: "e1",
    id: "p1",
    label: "OPENSHIFT",
    name: "OpenShift",
    updated_at: "2019-12-04T16:11:02.419867",
  },
  {
    created_at: "2017-08-21T13:22:41.891867",
    description:
      "RHEL is a Linux distribution developed by Red Hat and targeted toward the commercial market",
    etag: "e2",
    id: "p2",
    label: "RHEL",
    name: "RHEL",
    updated_at: "2018-02-20T12:36:33.595643",
  },
  {
    created_at: "2017-08-21T12:27:00.909914",
    description:
      "OpenStack is a free and open-source software platform for cloud computing",
    etag: "e3",
    id: "p3",
    label: "OPENSTACK",
    name: "OpenStack",
    updated_at: "2017-08-21T12:27:00.909914",
  },
];

export const topic: ITopic = {
  component_types: ["ocp"],
  component_types_optional: [],
  created_at: "2024-12-19T15:07:08.141819",
  data: {
    test: "ok",
  },
  etag: "97c3b94349bec92e1e3a616e6781f959",
  export_control: true,
  id: "9324f4a0-07df-448a-b66e-949546666d3e",
  name: "OCP-4.16",
  next_topic_id: null,
  product: products[0],
  product_id: "p1",
  state: "active",
  updated_at: "2024-12-19T15:08:17.423460",
};

export const components: IComponent[] = [
  {
    created_at: "2023-12-05T09:42:14.007890",
    data: {},
    display_name: "RHEL-8.8.0-20230125.0",
    etag: "716b9cd7255c7c65d68dc23fb9abce31",
    id: "914120f6-f33c-41b9-8245-19f9ff1f4c03",
    released_at: "2023-12-05T09:42:14.008496",
    state: "active",
    tags: ["tag 2", "tag 1"],
    team_id: null,
    topic_id: "4d61a6ce-1d7c-41fb-911e-075bc4216090",
    type: "compose",
    uid: "",
    updated_at: "2023-12-05T09:42:14.007890",
    url: "",
    version: "8.8.0-20230125.0",
  },
  {
    created_at: "2023-12-05T09:42:13.690572",
    data: {},
    display_name: "RHEL-9.2.0-20230125.12",
    etag: "354f78ee3a5c43fa64fe7df1a76240b1",
    id: "f602a981-5bcd-42fd-8f45-b13fdfbd3acf",
    released_at: "2023-12-05T09:42:13.692187",
    state: "active",
    tags: [],
    team_id: null,
    topic_id: "33594e69-f4f8-47fc-a773-e3e0c0724e70",
    type: "compose",
    uid: "",
    updated_at: "2023-12-05T09:42:13.690572",
    url: "",
    version: "9.2.0-20230125.12",
  },
];

export const remotecis: IRemoteci[] = [
  {
    api_secret:
      "F4trsVQGiMRQgBBsx5AqVugQIGUVqqidaUDzaMn4P243NVa1RchR0jBrTk7yMpYH",
    created_at: "2023-12-05T09:42:14.304617",
    data: {},
    etag: "38a612f7a53613e4ce607753b9eb2210",
    id: "f1371754-462f-4cfa-bed3-8cd6c9c60515",
    name: "Remoteci admin",
    public: false,
    state: "active",
    team_id: "8ca1e85b-7b5f-4563-a430-f4095bebbda0",
    updated_at: "2023-12-05T09:42:14.304617",
  },
];

export const feeder: IFeeder = {
  id: "f1",
  name: "feeder",
  team_id: "8ca1e85b-7b5f-4563-a430-f4095bebbda0",
  created_at: "2024-10-14T13:16:43.549941+00:00",
  etag: "53662e31a92b8b589e2b0bd82938904c",
  updated_at: "2024-10-14T13:16:43.549947+00:00",
  data: {},
  state: "active",
  api_secret: "api_secret",
};
