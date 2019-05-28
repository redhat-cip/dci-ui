import { normalize, denormalize } from "normalizr";
import * as schema from "./schema";

it("jobs normalize", () => {
  const data = [
    {
      components: [{ id: "component1" }],
      id: "job1",
      jobstates: [{ id: "jobstate1" }],
      remoteci: { id: "remoteci1" },
      topic: { id: "topic1" }
    },
    {
      components: [{ id: "component1" }],
      id: "job2",
      jobstates: [{ id: "jobstate2" }],
      remoteci: { id: "remoteci1" },
      topic: { id: "topic1" }
    }
  ];
  const dataNormalized = {
    result: ["job1", "job2"],
    entities: {
      jobs: {
        job1: {
          components: [{ id: "component1" }],
          id: "job1",
          jobstates: ["jobstate1"],
          remoteci: "remoteci1",
          topic: "topic1"
        },
        job2: {
          components: [{ id: "component1" }],
          id: "job2",
          jobstates: ["jobstate2"],
          remoteci: "remoteci1",
          topic: "topic1"
        }
      },
      topics: {
        topic1: {
          id: "topic1"
        }
      },
      remotecis: {
        remoteci1: {
          id: "remoteci1"
        }
      },
      jobstates: {
        jobstate1: {
          id: "jobstate1"
        },
        jobstate2: {
          id: "jobstate2"
        }
      }
    }
  };
  expect(normalize(data, schema.jobs)).toEqual(dataNormalized);
});
it("jobs denormalize", () => {
  const allIds = ["job1", "job2"];
  const entities = {
    jobs: {
      job1: {
        id: "job1",
        jobstates: ["jobstate1"],
        remoteci: "remoteci1",
        topic: "topic1"
      },
      job2: {
        id: "job2",
        jobstates: ["jobstate2"],
        remoteci: "remoteci1",
        topic: "topic1"
      }
    },
    topics: {
      topic1: {
        id: "topic1"
      }
    },
    remotecis: {
      remoteci1: {
        id: "remoteci1"
      }
    },
    jobstates: {
      jobstate1: {
        id: "jobstate1"
      },
      jobstate2: {
        id: "jobstate2"
      }
    }
  };
  const denormalizedJobs = [
    {
      id: "job1",
      jobstates: [{ id: "jobstate1" }],
      remoteci: { id: "remoteci1" },
      topic: { id: "topic1" }
    },
    {
      id: "job2",
      jobstates: [{ id: "jobstate2" }],
      remoteci: { id: "remoteci1" },
      topic: { id: "topic1" }
    }
  ];
  expect(denormalize(allIds, schema.jobs, entities)).toEqual(denormalizedJobs);
});
it("partial jobs normalize", () => {
  const data = [{ id: "job1" }];
  const dataNormalized = {
    result: ["job1"],
    entities: {
      jobs: {
        job1: {
          id: "job1"
        }
      }
    }
  };
  expect(normalize(data, schema.jobs)).toEqual(dataNormalized);
});

it("job normalize", () => {
  const data = { id: "job1" };
  const dataNormalized = {
    result: "job1",
    entities: {
      jobs: {
        job1: {
          id: "job1"
        }
      }
    }
  };
  expect(normalize(data, schema.job)).toEqual(dataNormalized);
});

it("users normalize", () => {
  const data = [{ id: "user1" }];

  const dataNormalized = {
    result: ["user1"],
    entities: {
      users: {
        user1: {
          id: "user1"
        }
      }
    }
  };
  expect(normalize(data, schema.users)).toEqual(dataNormalized);
});
