// Copyright 2015 Red Hat, Inc.
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

describe("global status component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("globalStatus", null, {
        topics: [
          {
            created_at: "2016-11-24T08:57:03.537039",
            etag: "66df8c7769d88abdb3109da1684befa4",
            id: "49c53850-7335-44f8-9b18-55153fd77300",
            label: null,
            name: "OSP9",
            next_topic: null,
            state: "active",
            updated_at: "2017-01-09T15:30:02.178469",
            jobdefinition_type: "puddle_osp",
            jobs: [
              {
                component_id: "92e9c6af-f16d-44d2-bb0f-811a84781a09",
                component_name: "RH7-RHOS-9.0 2017-04-07.5",
                component_type: "puddle_osp",
                job_created_at: "2017-05-05T22:30:33.943573",
                job_id: "d42c3b3d-4c6e-4a33-b0aa-1547047b03d5",
                job_status: "failure",
                remoteci_id: "e86ab5ba-695b-4337-a163-161e20b20f56",
                remoteci_name: "FutureVille1",
                team_id: "1517054b-36b4-4db9-a477-1a89623cc00a",
                team_name: "DELL",
                topic_name: "OSP9",
                state: "text-danger"
              },
              {
                component_id: "fb1bd646-ed72-4ae5-a0a8-ddf48d13f53f",
                component_name: "RH7-RHOS-9.0 2017-03-17.1",
                component_type: "puddle_osp",
                job_created_at: "2017-03-21T15:43:06.011924",
                job_id: "f8be702f-2b44-4d98-a23c-3c0c645f346c",
                job_status: "success",
                remoteci_id: "5cf17a3d-7b59-42b1-9536-6c4cce7ff7fc",
                remoteci_name: "FutureVille2",
                team_id: "1517054b-36b4-4db9-a477-1a89623cc00a",
                team_name: "DELL",
                topic_name: "OSP9",
                state: "text-success"
              },
              {
                component_id: "46837d00-4eb2-41ca-8e2d-d84fdb8737ee",
                component_name: "RH7-RHOS-9.0 2016-11-21.2",
                component_type: "puddle_osp",
                job_created_at: "2016-11-24T14:08:39.855764",
                job_id: "83b9ddb7-d832-492b-a820-45819df61375",
                job_status: "success",
                remoteci_id: "6653f35a-41a5-4e1d-9365-b79a530e86be",
                remoteci_name: "Juniper-DCI-LAB",
                team_id: "fc0b410e-9ce0-4dac-ade8-cd51339f5c6e",
                team_name: "Juniper",
                topic_name: "OSP9",
                state: "text-success"
              },
              {
                component_id: "52b62f63-d8b6-469d-ba67-7ac03efabc33",
                component_name: "RH7-RHOS-9.0 2017-05-05.1",
                component_type: "puddle_osp",
                job_created_at: "2017-05-09T11:03:39.702645",
                job_id: "7101696c-e105-44e5-b785-d7a789bd0726",
                job_status: "success",
                remoteci_id: "cb61a7be-cc63-4b48-93bd-c4e04d70be5c",
                remoteci_name: "NEC-DCI-001",
                team_id: "c502f938-8445-4ac4-9b9f-2a7cc415293f",
                team_name: "NEC",
                topic_name: "OSP9",
                state: "text-success"
              }
            ]
          },
          {
            created_at: "2016-03-01T16:32:17.244327",
            etag: "a32b570dc165e9e3786be6d6819fbac3",
            id: "996f1599-887a-4be6-bad6-758cf6c969ef",
            label: null,
            name: "OSP8",
            next_topic: "49c53850-7335-44f8-9b18-55153fd77300",
            state: "active",
            updated_at: "2017-01-09T15:29:39.943342",
            jobdefinition_type: "puddle_osp",
            jobs: [
              {
                component_id: "2b4800bd-9858-4cd6-b50d-d4fb286177a9",
                component_name: "RH7-RHOS-8.0 2017-04-07.2",
                component_type: "puddle_osp",
                job_created_at: "2017-04-27T12:33:12.210011",
                job_id: "8406be4b-85f9-4cc8-bd64-11034c7068ad",
                job_status: "success",
                remoteci_id: "dfeaac59-d466-43ed-945a-d96f03a46a1f",
                remoteci_name: "BXB_DCI",
                team_id: "41bdfd42-686a-447e-add4-83c7c9afbd1a",
                team_name: "cisco",
                topic_name: "OSP8",
                state: "text-success"
              },
              {
                component_id: "2b4800bd-9858-4cd6-b50d-d4fb286177a9",
                component_name: "RH7-RHOS-8.0 2017-04-07.2",
                component_type: "puddle_osp",
                job_created_at: "2017-05-08T15:38:18.072742",
                job_id: "84150fa1-581f-48bc-a306-66d396c1f289",
                job_status: "failure",
                remoteci_id: "e86ab5ba-695b-4337-a163-161e20b20f56",
                remoteci_name: "FutureVille1",
                team_id: "1517054b-36b4-4db9-a477-1a89623cc00a",
                team_name: "DELL",
                topic_name: "OSP8",
                state: "text-danger"
              }
            ]
          }
        ]
      });
      component.$onInit();
    })
  );

  it("should order topic", function() {
    expect(component.topics[0].name).toBe("OSP8");
    expect(component.topics[1].name).toBe("OSP9");
  });

  it("should computes job percentage errors per topic", function() {
    expect(component.topics[0].percentageErrors).toBe(50);
    expect(component.topics[1].percentageErrors).toBe(25);
  });
});
