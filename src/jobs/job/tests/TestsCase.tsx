import {
  Button,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from "@patternfly/react-core";
import { useState } from "react";
import { CaretDownIcon } from "@patternfly/react-icons";
import { ITestsCase } from "types";
import { CopyButton } from "ui";

interface TestsCaseProps {
  testscase: ITestsCase;
}

export default function TestsCase({ testscase }: TestsCaseProps) {
  const [seeDetails, setSeeDetails] = useState(false);
  return (
    <tbody className={`${seeDetails ? "pf-m-expanded" : ""}`}>
      <tr>
        <td className="text-center pf-c-table__toggle">
          <Button
            variant="plain"
            onClick={() => setSeeDetails(!seeDetails)}
            className={`${seeDetails ? "pf-m-expanded" : ""}`}
          >
            <CaretDownIcon className="pf-c-table__toggle-icon" />
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
        <tr className="pf-c-table__expandable-row pf-m-expanded">
          <td colSpan={100}>
            <div className="pf-c-table__expandable-row-content">
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Type</DescriptionListTerm>
                  <DescriptionListDescription>
                    {testscase.type}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Message</DescriptionListTerm>
                  <DescriptionListDescription>
                    {testscase.message}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                {testscase.properties.map((property) => {
                  return (
                    <DescriptionListGroup
                      key={`${property.name}:${property.value}`}
                    >
                      <DescriptionListTerm>{property.name}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {property.value}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  );
                })}

                {testscase.value ? (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Value</DescriptionListTerm>
                    <DescriptionListDescription>
                      <CodeBlock
                        actions={[
                          <CodeBlockAction>
                            <CopyButton
                              text={testscase.value}
                              variant="plain"
                            />
                          </CodeBlockAction>,
                        ]}
                      >
                        <CodeBlockCode id="testscase.value">
                          {testscase.value}
                        </CodeBlockCode>
                      </CodeBlock>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ) : null}

                {testscase.stdout ? (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Standard output</DescriptionListTerm>
                    <DescriptionListDescription>
                      <CodeBlock
                        actions={[
                          <CodeBlockAction>
                            <CopyButton
                              text={testscase.stdout}
                              variant="plain"
                            />
                          </CodeBlockAction>,
                        ]}
                      >
                        <CodeBlockCode id="testscase.stdout">
                          {testscase.stdout}
                        </CodeBlockCode>
                      </CodeBlock>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ) : null}

                {testscase.stderr ? (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Standard error</DescriptionListTerm>
                    <DescriptionListDescription>
                      <CodeBlock
                        actions={[
                          <CodeBlockAction>
                            <CopyButton
                              text={testscase.stderr}
                              variant="plain"
                            />
                          </CodeBlockAction>,
                        ]}
                      >
                        <CodeBlockCode id="testscase.stderr">
                          {testscase.stderr}
                        </CodeBlockCode>
                      </CodeBlock>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ) : null}
              </DescriptionList>
            </div>
          </td>
        </tr>
      ) : null}
    </tbody>
  );
}
