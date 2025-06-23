import {
  getCompletions,
  applyCompletion,
  AutoCompletionOptions,
  parseInput,
  defaultOptions,
  AutoCompletionValues,
  extractAutocompleteInfo,
} from "./autocompletion";

type TestStep =
  | {
      type: string;
      cursor?: number;
      input: string;
      autocomplete: string[];
    }
  | {
      select: string;
      input: string;
      autocomplete: string[];
    };

function runAutocompleteTest(
  steps: TestStep[],
  userOptions: Partial<AutoCompletionOptions> = {},
  defaultValues: AutoCompletionValues = {
    status: ["success", "error", "failure"],
  },
) {
  const options: AutoCompletionOptions = {
    fields: [
      { name: "name", type: "string" },
      { name: "duration", type: "number" },
      { name: "tags", type: "list" },
      { name: "topic.name", type: "string" },
      { name: "team.name", type: "string" },
    ],
    operators: {
      comparison: {
        string: ["=", "!=", "in", "not_in"],
        number: ["=", "!=", "in", "not_in", ">", "<"],
        boolean: ["=", "!="],
        list: ["in", "not_in"],
      },
      logical: ["and", "or"],
    },
    ...userOptions,
  };
  let input = "";
  let cursor = 0;
  for (const step of steps) {
    if ("type" in step) {
      input += step.type;
      if (step.cursor) {
        cursor = step.cursor;
      } else {
        cursor += step.type.length;
      }
    }
    if ("select" in step) {
      const completions = getCompletions(input, cursor, defaultValues, options);
      const selected = completions.find((c) => c.value === step.select);
      expect(selected).toBeDefined();
      if (selected) {
        const { newValue, newCursor } = applyCompletion({
          value: input,
          cursor: cursor,
          completion: selected,
        });
        input = newValue;
        cursor = newCursor;
      }
    }
    const completions = getCompletions(input, cursor, defaultValues, options);
    expect(completions.map((c) => c.value)).toEqual(step.autocomplete);
    expect(input).toEqual(step.input);
  }
}

describe("getCompletions: input", () => {
  test("is empty", () => {
    runAutocompleteTest([{ type: "", input: "", autocomplete: [] }]);
  });
  test("starts with a paranthesis", () => {
    runAutocompleteTest([
      {
        type: "(",
        input: "(",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("one letter matching field", () => {
    runAutocompleteTest([
      {
        type: "(t",
        input: "(t",
        autocomplete: ["tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("two letters matching field", () => {
    runAutocompleteTest([
      {
        type: "(to",
        input: "(to",
        autocomplete: ["topic.name"],
      },
    ]);
  });
  test("two letters no match", () => {
    runAutocompleteTest([
      {
        type: "(tz",
        input: "(tz",
        autocomplete: [],
      },
    ]);
  });
  test("more complex autocomplete scenario", () => {
    runAutocompleteTest([
      {
        type: "(",
        input: "(",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
      {
        type: "t",
        input: "(t",
        autocomplete: ["tags", "topic.name", "team.name"],
      },
      {
        type: "o",
        input: "(to",
        autocomplete: ["topic.name"],
      },
      {
        select: "topic.name",
        input: "(topic.name ",
        autocomplete: ["=", "!=", "in", "not_in"],
      },
      {
        select: "not_in",
        input: "(topic.name not_in ['",
        autocomplete: [],
      },
      { type: "t", input: "(topic.name not_in ['t", autocomplete: [] },
    ]);
  });
  test("if autocompletion are provided use them in the autocompletion", () => {
    runAutocompleteTest(
      [
        {
          type: "(",
          input: "(",
          autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
        },
        {
          select: "topic.name",
          input: "(topic.name ",
          autocomplete: ["=", "!=", "in", "not_in"],
        },
        {
          select: "not_in",
          input: "(topic.name not_in ['",
          autocomplete: ["topic 1", "topic 2"],
        },
        {
          select: "topic 1",
          input: "(topic.name not_in ['topic 1'])",
          autocomplete: ["and", "or"],
        },
      ],
      {},
      {
        "topic.name": ["topic 1", "topic 2"],
      },
    );
  });
  test("logical operator", () => {
    runAutocompleteTest([
      {
        type: "(name='test')",
        input: "(name='test')",
        autocomplete: ["and", "or"],
      },
      {
        select: "and",
        input: "(name='test') and (",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("nrt user write closing parenthesis but move cursor before", () => {
    runAutocompleteTest([
      {
        type: "(components.name = '')",
        cursor: 20,
        input: "(components.name = '')",
        autocomplete: [],
      },
    ]);
  });
  test("tests.testsuites.testcases.*", () => {
    runAutocompleteTest(
      [
        {
          type: "(tes",
          input: "(tes",
          autocomplete: [
            "tests.name",
            "tests.testsuites.testcases.name",
            "tests.testsuites.testcases.action",
            "tests.testsuites.testcases.classname",
          ],
        },
      ],
      defaultOptions,
    );
  });
});

describe("parseInput", () => {
  test("parseInput", () => {
    expect(parseInput("")).toBe(null);
    expect(parseInput("(")).toBe(null);
    expect(parseInput("(st")).toEqual({
      field: "st",
      operator: null,
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status")).toEqual({
      field: "status",
      operator: null,
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(team")).toEqual({
      field: "team",
      operator: null,
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(team.")).toEqual({
      field: "team.",
      operator: null,
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(team.name")).toEqual({
      field: "team.name",
      operator: null,
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status=")).toEqual({
      field: "status",
      operator: "=",
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in")).toEqual({
      field: "status",
      operator: "in",
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in [")).toEqual({
      field: "status",
      operator: "in",
      value: null,
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status='")).toEqual({
      field: "status",
      operator: "=",
      value: "",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in ['")).toEqual({
      field: "status",
      operator: "in",
      value: "",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status='suc")).toEqual({
      field: "status",
      operator: "=",
      value: "suc",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in ['suc")).toEqual({
      field: "status",
      operator: "in",
      value: "suc",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status='success")).toEqual({
      field: "status",
      operator: "=",
      value: "success",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in ['success")).toEqual({
      field: "status",
      operator: "in",
      value: "success",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status='success'")).toEqual({
      field: "status",
      operator: "=",
      value: "success",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in ['success'")).toEqual({
      field: "status",
      operator: "in",
      value: "success",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status in ['success']")).toEqual({
      field: "status",
      operator: "in",
      value: "success",
      lastParenthesisIndex: 0,
    });
    expect(parseInput("(status='success')")).toBe(null);
    expect(parseInput("(status in ['success'])")).toBe(null);
    expect(parseInput("(status='success') and (")).toBe(null);
    expect(parseInput("(status='success') and (status=")).toEqual({
      field: "status",
      operator: "=",
      value: null,
      lastParenthesisIndex: 23,
    });
  });
});

describe("applyCompletion", () => {
  test("partial field", () => {
    expect(
      applyCompletion({
        value: "(to",
        cursor: 3,
        completion: {
          value: "topic.name",
          insertText: "topic.name ",
        },
      }),
    ).toEqual({
      newCursor: 12,
      newValue: "(topic.name ",
    });
  });
  test("with field", () => {
    expect(
      applyCompletion({
        value: "(topic.name ",
        cursor: 12,
        completion: { value: "not_in", insertText: " not_in ['" },
      }),
    ).toEqual({
      newCursor: 21,
      newValue: "(topic.name not_in ['",
    });
  });
  test("with field and operator", () => {
    expect(
      applyCompletion({
        value: "(status in ",
        cursor: 11,
        completion: {
          value: "success",
          insertText: "['success']",
        },
      }),
    ).toEqual({
      newCursor: 22,
      newValue: "(status in ['success']",
    });
  });
  test("with logical operator", () => {
    expect(
      applyCompletion({
        value: "(name='test')",
        cursor: 13,
        completion: { value: "and", insertText: " and (" },
      }),
    ).toEqual({
      newCursor: 19,
      newValue: "(name='test') and (",
    });
  });
  test("nrt nested field applied", () => {
    expect(
      applyCompletion({
        value: "(components.",
        cursor: 12,
        completion: {
          value: "components.name",
          insertText: "components.name ",
        },
      }),
    ).toEqual({
      newCursor: 17,
      newValue: "(components.name ",
    });
  });
  test("nrt status not_in", () => {
    expect(
      applyCompletion({
        value: "(status",
        cursor: 7,
        completion: { value: "not_in", insertText: " not_in ['" },
      }),
    ).toEqual({
      newCursor: 17,
      newValue: "(status not_in ['",
    });
  });
  test("multiple fields", () => {
    expect(
      applyCompletion({
        value: "(status='success') and (status",
        cursor: 30,
        completion: { value: "not_in", insertText: " not_in ['" },
      }),
    ).toEqual({
      newCursor: 40,
      newValue: "(status='success') and (status not_in ['",
    });
  });
  test("apply completion after parenthesis", () => {
    expect(
      applyCompletion({
        value: "(",
        cursor: 1,
        completion: { value: "topic.name", insertText: "topic.name " },
      }),
    ).toEqual({
      newValue: "(topic.name ",
      newCursor: 12,
    });
  });
  test("apply completion after parenthesis", () => {
    expect(
      applyCompletion({
        value: "(topic.name not_in ['",
        cursor: 21,
        completion: { value: "topic 1", insertText: "topic 1'])" },
      }),
    ).toEqual({
      newValue: "(topic.name not_in ['topic 1'])",
      newCursor: 31,
    });
  });
});

describe("extractAutocompleteInfo", () => {
  test("empty", () => {
    expect(extractAutocompleteInfo("", 0)).toBe(null);
  });

  test("(name='", () => {
    expect(extractAutocompleteInfo("(name='", 7)).toEqual({
      field: "name",
      value: "",
    });
  });

  test("( name = '", () => {
    expect(extractAutocompleteInfo("(name='", 7)).toEqual({
      field: "name",
      value: "",
    });
  });

  test("(name='tot", () => {
    expect(extractAutocompleteInfo("(name='tot", 10)).toEqual({
      field: "name",
      value: "tot",
    });
  });

  test("(name in ['", () => {
    expect(extractAutocompleteInfo("(name in ['", 11)).toEqual({
      field: "name",
      value: "",
    });
  });

  test("(name in ['tot", () => {
    expect(extractAutocompleteInfo("(name in ['tot", 14)).toEqual({
      field: "name",
      value: "tot",
    });
  });

  test("(name in ['foo', '", () => {
    expect(extractAutocompleteInfo("(name in ['foo', '", 18)).toEqual({
      field: "name",
      value: "",
    });
  });

  test("(name in ['foo', 'bar", () => {
    expect(extractAutocompleteInfo("(name in ['foo', 'bar", 22)).toEqual({
      field: "name",
      value: "bar",
    });
  });

  test("(name='foo') and (status in ['failure', 'err", () => {
    expect(
      extractAutocompleteInfo(
        "(name='foo') and (status in ['failure', 'err",
        44,
      ),
    ).toEqual({ field: "status", value: "err" });
  });

  test("team.name='foo", () => {
    expect(extractAutocompleteInfo("(team.name='foo", 15)).toEqual({
      field: "team.name",
      value: "foo",
    });
  });

  test("(name!='", () => {
    expect(extractAutocompleteInfo("(name!='", 8)).toEqual({
      field: "name",
      value: "",
    });
  });

  test("(name not_in ['foo', 'bar", () => {
    expect(extractAutocompleteInfo("(name not_in ['foo', 'bar", 25)).toEqual({
      field: "name",
      value: "bar",
    });
  });
});
