import { Button, Label } from "@patternfly/react-core";
import React, { useState } from "react";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";
import { Pre } from "jobs/jobStates/JobStateComponents";
import { ITestsCase } from "types";

interface TestsCaseProps {
  testscase: ITestsCase;
}

export default function TestsCase({ testscase }: TestsCaseProps) {
  const [seeDetails, setSeeDetails] = useState(false);
  return (
    <>
      <tr>
        <td className="text-center">
          <Button variant="link" onClick={() => setSeeDetails(!seeDetails)}>
            {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
          </Button>
        </td>
        <td>
          {testscase.action === "skipped" && <Label color="orange">Skip</Label>}
          {testscase.action === "failure" && <Label color="red">Failure</Label>}
          {testscase.action === "error" && <Label color="red">Error</Label>}
          {testscase.action === "passed" && <Label color="green">Pass</Label>}
        </td>
        <td>{testscase.regression && <Label color="red">Regression</Label>}</td>
        <td>
          {testscase.successfix && <Label color="green">Success fix</Label>}
        </td>
        <td>{testscase.classname || testscase.name}</td>
        <td>{testscase.name}</td>
        <td className="text-right col-xs-1">
          {testscase.time}
          &nbsp;s
        </td>
      </tr>
      {seeDetails ? (
        <tr style={{ borderTop: 0 }}>
          <td colSpan={6}>
            <b>Type:</b> {testscase.type}
            <br />
            <b>Message:</b> {testscase.message}
            <br />
            <b>Value:</b>
            <Pre>{testscase.value}</Pre>
          </td>
        </tr>
      ) : null}
    </>
  );
}
