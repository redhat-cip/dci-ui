// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import test from "ava";
import { normalize, denormalize } from "normalizr";
import * as schema from "./schema";

test("jobs normalize", t => {
  const data = [
    {
      components: [{ id: "component1" }],
      id: "job1",
      jobstates: [{ id: "jobstate1" }],
      rconfiguration: { id: "rconfiguration1" },
      remoteci: { id: "remoteci1" },
      results: [{ id: "result1" }, { id: "result2" }],
      topic: { id: "topic1" }
    },
    {
      components: [{ id: "component1" }],
      id: "job2",
      jobstates: [{ id: "jobstate2" }],
      rconfiguration: { id: "rconfiguration1" },
      remoteci: { id: "remoteci1" },
      results: [{ id: "result3" }, { id: "result4" }],
      topic: { id: "topic1" }
    }
  ];
  const dataNormalized = {
    result: ["job1", "job2"],
    entities: {
      jobs: {
        job1: {
          components: ["component1"],
          id: "job1",
          jobstates: ["jobstate1"],
          rconfiguration: "rconfiguration1",
          remoteci: "remoteci1",
          results: ["result1", "result2"],
          topic: "topic1"
        },
        job2: {
          components: ["component1"],
          id: "job2",
          jobstates: ["jobstate2"],
          rconfiguration: "rconfiguration1",
          remoteci: "remoteci1",
          results: ["result3", "result4"],
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
      },
      results: {
        result1: {
          id: "result1"
        },
        result2: {
          id: "result2"
        },
        result3: {
          id: "result3"
        },
        result4: {
          id: "result4"
        }
      },
      components: {
        component1: {
          id: "component1"
        }
      },
      rconfigurations: {
        rconfiguration1: {
          id: "rconfiguration1"
        }
      }
    }
  };
  t.deepEqual(normalize(data, schema.jobs), dataNormalized);
});
test("jobs denormalize", t => {
  const allIds = ["job1", "job2"];
  const entities = {
    jobs: {
      job1: {
        components: ["component1"],
        id: "job1",
        jobstates: ["jobstate1"],
        rconfiguration: "rconfiguration1",
        remoteci: "remoteci1",
        results: ["result1", "result2"],
        topic: "topic1"
      },
      job2: {
        components: ["component1"],
        id: "job2",
        jobstates: ["jobstate2"],
        rconfiguration: "rconfiguration1",
        remoteci: "remoteci1",
        results: ["result3", "result4"],
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
    },
    results: {
      result1: {
        id: "result1"
      },
      result2: {
        id: "result2"
      },
      result3: {
        id: "result3"
      },
      result4: {
        id: "result4"
      }
    },
    components: {
      component1: {
        id: "component1"
      }
    },
    rconfigurations: {
      rconfiguration1: {
        id: "rconfiguration1"
      }
    }
  };
  const denormalizedJobs = [
    {
      components: [{ id: "component1" }],
      id: "job1",
      jobstates: [{ id: "jobstate1" }],
      rconfiguration: { id: "rconfiguration1" },
      remoteci: { id: "remoteci1" },
      results: [{ id: "result1" }, { id: "result2" }],
      topic: { id: "topic1" }
    },
    {
      components: [{ id: "component1" }],
      id: "job2",
      jobstates: [{ id: "jobstate2" }],
      rconfiguration: { id: "rconfiguration1" },
      remoteci: { id: "remoteci1" },
      results: [{ id: "result3" }, { id: "result4" }],
      topic: { id: "topic1" }
    }
  ];
  t.deepEqual(denormalize(allIds, schema.jobs, entities), denormalizedJobs);
});
test("partial jobs normalize", t => {
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
  t.deepEqual(normalize(data, schema.jobs), dataNormalized);
});

test("job normalize", t => {
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
  t.deepEqual(normalize(data, schema.job), dataNormalized);
});

test("users normalize", t => {
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
  t.deepEqual(normalize(data, schema.users), dataNormalized);
});
