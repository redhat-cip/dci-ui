import { parseGraphsFromSearch, createSearchFromGraphs } from "./filters";

describe("parseGraphsFromSearch", () => {
  test("parse empty string return empty graphs", () => {
    expect(parseGraphsFromSearch(null)).toEqual([]);
  });
  test("parse empty string return empty graphs", () => {
    expect(parseGraphsFromSearch("")).toEqual([]);
  });
  test("parse graphs from v1 search", () => {
    const graphs = parseGraphsFromSearch(
      "%5B%7B%22keys%22%3A%5B%7B%22key%22%3A%22workarounds%22%2C%22color%22%3A%22%234394e5%22%7D%2C%7B%22key%22%3A%22packet_loss_total_perc%22%2C%22color%22%3A%22%23f5921b%22%7D%5D%2C%22graphType%22%3A%22line%22%7D%5D",
    );
    expect(graphs).toEqual([
      {
        keys: [
          {
            key: "workarounds",
            color: "#4394e5",
            axis: "left",
          },
          {
            key: "packet_loss_total_perc",
            color: "#f5921b",
            axis: "left",
          },
        ],
        graphType: "line",
        name: "Graph workarounds packet_loss_total_perc",
      },
    ]);
  });
  test("parse graphs from search", () => {
    const graphs = parseGraphsFromSearch(
      "%5B%7B%22keys%22%3A%5B%7B%22key%22%3A%22workarounds%22%2C%22color%22%3A%22%234394e5%22%2C%22axis%22%3A%22left%22%7D%2C%7B%22key%22%3A%22packet_loss_total_perc%22%2C%22color%22%3A%22%23f5921b%22%2C%22axis%22%3A%22left%22%7D%5D%2C%22graphType%22%3A%22bar%22%2C%22name%22%3A%22Graph%22%7D%5D",
    );
    expect(graphs).toEqual([
      {
        keys: [
          {
            key: "workarounds",
            color: "#4394e5",
            axis: "left",
          },
          {
            key: "packet_loss_total_perc",
            color: "#f5921b",
            axis: "left",
          },
        ],
        graphType: "bar",
        name: "Graph",
      },
    ]);
  });
});

describe("createSearchFromGraphs", () => {
  test("create search from empty graphs", () => {
    expect(createSearchFromGraphs([])).toBe(null);
  });
  test("create search from one graph", () => {
    expect(
      createSearchFromGraphs([
        {
          keys: [
            {
              key: "workarounds",
              color: "#4394e5",
              axis: "left",
            },
            {
              key: "packet_loss_total_perc",
              color: "#f5921b",
              axis: "left",
            },
          ],
          graphType: "bar",
          name: "Graph",
        },
      ]),
    ).toBe(
      "%5B%7B%22keys%22%3A%5B%7B%22key%22%3A%22workarounds%22%2C%22color%22%3A%22%234394e5%22%2C%22axis%22%3A%22left%22%7D%2C%7B%22key%22%3A%22packet_loss_total_perc%22%2C%22color%22%3A%22%23f5921b%22%2C%22axis%22%3A%22left%22%7D%5D%2C%22graphType%22%3A%22bar%22%2C%22name%22%3A%22Graph%22%7D%5D",
    );
  });
  test("create search from two graphs", () => {
    expect(
      createSearchFromGraphs([
        {
          keys: [
            {
              key: "workarounds",
              color: "#4394e5",
              axis: "left",
            },
            {
              key: "packet_loss_total_perc",
              color: "#f5921b",
              axis: "left",
            },
          ],
          graphType: "line",
          name: "Graph 1",
        },
        {
          keys: [
            {
              key: "workarounds",
              color: "#4394e5",
              axis: "left",
            },
          ],
          graphType: "bar",
          name: "Graph 2",
        },
      ]),
    ).toBe(
      "%5B%7B%22keys%22%3A%5B%7B%22key%22%3A%22workarounds%22%2C%22color%22%3A%22%234394e5%22%2C%22axis%22%3A%22left%22%7D%2C%7B%22key%22%3A%22packet_loss_total_perc%22%2C%22color%22%3A%22%23f5921b%22%2C%22axis%22%3A%22left%22%7D%5D%2C%22graphType%22%3A%22line%22%2C%22name%22%3A%22Graph%201%22%7D%2C%7B%22keys%22%3A%5B%7B%22key%22%3A%22workarounds%22%2C%22color%22%3A%22%234394e5%22%2C%22axis%22%3A%22left%22%7D%5D%2C%22graphType%22%3A%22bar%22%2C%22name%22%3A%22Graph%202%22%7D%5D",
    );
  });
});
