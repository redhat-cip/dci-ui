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
import { filterTestsCases } from "./testsFilters";

test("filter test case no filter", t => {
  const testcase = { id: "tc1" };
  t.is(
    filterTestsCases({
      regression: false,
      passed: false,
      skipped: false,
      error: false,
      failure: false
    })(testcase),
    true
  );
});

test("filter test case regression", t => {
  const testcase = { action: "failure", regression: true };
  t.is(
    filterTestsCases({
      regression: true,
      passed: false,
      skipped: false,
      error: false,
      failure: false
    })(testcase),
    true
  );
});

test("filter test case regression false", t => {
  const testcase = { action: "passed", regression: false };
  t.is(
    filterTestsCases({
      regression: true,
      passed: false,
      skipped: false,
      error: false,
      failure: false
    })(testcase),
    false
  );
});

test("filter test case passed and regression", t => {
  const testcase1 = { action: "failure", regression: true };
  t.is(
    filterTestsCases({
      regression: true,
      passed: true,
      skipped: false,
      error: false,
      failure: false
    })(testcase1),
    true
  );
  const testcase2 = { action: "passed", regression: false };
  t.is(
    filterTestsCases({
      regression: true,
      passed: true,
      skipped: false,
      error: false,
      failure: false
    })(testcase2),
    true
  );
});
