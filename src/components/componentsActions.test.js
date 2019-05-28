import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";
import { fetchLatestComponents } from "./componentsActions";

const mockStore = configureMockStore([thunk]);

const axiosMock = new axiosMockAdapter(axios);

it("fetchLatestComponents", () => {
  axiosMock
    .onGet("https://api.example.org/api/v1/topics/abc")
    .reply(200, { topic: { component_types: ["Compose", "Harness"] } });
  axiosMock
    .onGet("https://api.example.org/api/v1/topics/abc/components", {
      params: {
        sort: "-created_at",
        limit: 3,
        offset: 0,
        where: "type:Compose,state:active"
      }
    })
    .reply(200, { components: [{ id: "c11" }, { id: "c21" }, { id: "c31" }] });
  axiosMock
    .onGet("https://api.example.org/api/v1/topics/abc/components", {
      params: {
        sort: "-created_at",
        limit: 3,
        offset: 0,
        where: "type:Harness,state:active"
      }
    })
    .reply(200, { components: [{ id: "c12" }, { id: "c22" }, { id: "c32" }] });
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(fetchLatestComponents({ id: "abc" })).then(r => {
    expect(r.data).toEqual({
      components: [
        { id: "c11" },
        { id: "c21" },
        { id: "c31" },
        { id: "c12" },
        { id: "c22" },
        { id: "c32" }
      ]
    });
  });
});
