import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";
import { fetchLatestComponents } from "./topicsActions";

const mockStore = configureMockStore([thunk]);

const axiosMock = new axiosMockAdapter(axios);

it("fetchLatestComponents", () => {
  axiosMock
    .onGet("https://api.example.org/api/v1/topics/t1/components", {
      params: {
        sort: "-created_at",
        limit: 1,
        offset: 0,
        where: "type:Compose,state:active"
      }
    })
    .reply(200, { components: [{ id: "c11" }] });
  axiosMock
    .onGet("https://api.example.org/api/v1/topics/t1/components", {
      params: {
        sort: "-created_at",
        limit: 1,
        offset: 0,
        where: "type:Harness,state:active"
      }
    })
    .reply(200, { components: [{ id: "c12" }] });
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(
      fetchLatestComponents({
        id: "t1",
        component_types: ["Compose", "Harness"]
      })
    )
    .then(r => {
      expect(r.data).toEqual({
        components: [
          { id: "c11" },
          { id: "c12" }
        ]
      });
    });
});
