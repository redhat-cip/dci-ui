import { transposePerformance } from "./performanceActions";

test("should transpose performance", () => {
  const performance = [
    {
      job_id: "bac7cc7c-a3c3-4a71-8af5-f7abca9c06ef",
      testscases: [
        {
          classname: "/distribution/check-install",
          delta: 0,
          name: "",
          time: 8,
        },
        {
          classname: "/distribution/check-install",
          delta: 0,
          name: "Sysinfo",
          time: 2,
        },
        {
          classname: "/distribution/reservesys",
          delta: 0,
          name: "",
          time: 2,
        },
        {
          classname: "/distribution/reservesys",
          delta: 0,
          name: "exit_code",
          time: 26114,
        },
      ],
    },
    {
      job_id: "49b99a38-f535-43bb-8f54-67c31784fe6b",
      testscases: [
        {
          classname: "/distribution/check-install",
          delta: 12.5,
          name: "",
          time: 9,
        },
        {
          classname: "/distribution/check-install",
          delta: 0,
          name: "Sysinfo",
          time: 2,
        },
        {
          classname: "/distribution/reservesys",
          delta: 0,
          name: "",
          time: 2,
        },
        {
          classname: "/distribution/reservesys",
          delta: 0.5973807153251129,
          name: "exit_code",
          time: 26270,
        },
      ],
    },
  ];

  expect(transposePerformance(performance)).toEqual({
    headers: [
      null,
      null,
      { job_id: "bac7cc7c-a3c3-4a71-8af5-f7abca9c06ef", title: "j1" },
      { job_id: "49b99a38-f535-43bb-8f54-67c31784fe6b", title: "j2" },
    ],
    rows: [
      ["/distribution/check-install", "", 0, 12.5],
      ["/distribution/reservesys", "exit_code", 0, 0.5973807153251129],
      ["/distribution/reservesys", "", 0, 0],
      ["/distribution/check-install", "Sysinfo", 0, 0],
    ],
  });
});
