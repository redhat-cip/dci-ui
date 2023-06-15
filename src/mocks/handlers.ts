import { rest } from "msw";
import { IIdentity, IProduct, ITeam } from "types";

export const handlers = [
  rest.get("https://api.distributed-ci.io/api/v1/products", (req, res, ctx) => {
    const products: {
      _meta: { count: number };
      products: IProduct[];
    } = {
      _meta: {
        count: 3,
      },
      products: [
        {
          created_at: "2019-12-04T15:58:21.528598",
          description:
            "OpenShift is an open source container application platform",
          etag: "e1",
          id: "p1",
          label: "OPENSHIFT",
          name: "OpenShift",
          //state: "active",
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
          //state: "active",
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
          //state: "active",
          updated_at: "2017-08-21T12:27:00.909914",
        },
      ],
    };
    return res(ctx.json(products));
  }),
  rest.get("https://api.distributed-ci.io/api/v1/identity", (req, res, ctx) => {
    const identity: {
      identity: IIdentity;
    } = {
      identity: {
        email: "u1@redhat.com",
        etag: "191539996cb96d416cd386558de5d499",
        fullname: "First User",
        id: "a48ecab4-01d0-97d9-4f45-f7b938808e23",
        name: "u1",
        teams: {
          t1: {
            id: "t1",
            name: "First Team",
          } as ITeam,
        },
        timezone: "Europe/Paris",
      },
    };
    return res(ctx.json(identity));
  }),
];

export default handlers;
