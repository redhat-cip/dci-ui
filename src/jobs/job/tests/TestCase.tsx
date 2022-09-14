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
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@patternfly/react-icons";
import { ITestCase } from "types";
import { CopyButton } from "ui";
import {
  global_BackgroundColor_200,
  global_Color_100,
} from "@patternfly/react-tokens";

interface TestCaseProps {
  testcase: ITestCase;
}

export default function TestCase({ testcase }: TestCaseProps) {
  const [seeDetails, setSeeDetails] = useState(false);
  return (
    <div style={{ color: global_Color_100.value }}>
      <div
        className="pf-l-grid"
        style={{ borderTop: `1px solid ${global_BackgroundColor_200.value}` }}
      >
        <div
          className="pf-l-grid__item pf-m-1-col"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Button
            isSmall
            variant="link"
            onClick={() => setSeeDetails(!seeDetails)}
          >
            {seeDetails ? (
              <CaretDownIcon className="mr-xs" />
            ) : (
              <CaretRightIcon className="mr-xs" />
            )}
          </Button>
          {testcase.action === "skipped" && (
            <Label isCompact color="orange">
              Skip
            </Label>
          )}
          {testcase.action === "failure" && (
            <Label isCompact color="red">
              Failure
            </Label>
          )}
          {testcase.action === "error" && (
            <Label isCompact color="red">
              Error
            </Label>
          )}
          {testcase.action === "success" && (
            <Label isCompact color="green">
              Pass
            </Label>
          )}
          {testcase.regression && (
            <Label isCompact color="red">
              Regression
            </Label>
          )}
          {testcase.successfix && (
            <Label isCompact color="green">
              Success fix
            </Label>
          )}
        </div>
        <div
          className="pf-l-grid__item pf-m-10-col"
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          title={`${testcase.classname} ${testcase.name}`}
        >
          <Button
            isSmall
            variant="link"
            onClick={() => setSeeDetails(!seeDetails)}
          >
            {testcase.classname} {testcase.name}
          </Button>
        </div>
        <div
          className="pf-l-grid__item pf-m-1-col"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            fontSize: "0.8em",
          }}
        >
          {testcase.time} s
        </div>
      </div>
      {seeDetails ? (
        <div className="pf-l-grid">
          <div
            className="pf-l-grid__item pf-m-12-col"
            style={{
              paddingLeft: ".5em",
              paddingRight: ".5em",
              paddingTop: "2em",
              paddingBottom: "2em",
            }}
          >
            <DescriptionList
              columnModifier={{
                default: "2Col",
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {testcase.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Class name</DescriptionListTerm>
                <DescriptionListDescription>
                  {testcase.classname}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>
                  {testcase.type}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Message</DescriptionListTerm>
                <DescriptionListDescription>
                  {testcase.message}
                </DescriptionListDescription>
              </DescriptionListGroup>
              {testcase.properties.map((property) => {
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
            </DescriptionList>
            <DescriptionList style={{ marginTop: "1em" }}>
              {testcase.value ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Value</DescriptionListTerm>
                  <DescriptionListDescription>
                    <CodeBlock
                      actions={[
                        <CodeBlockAction>
                          <CopyButton text={testcase.value} variant="plain" />
                        </CodeBlockAction>,
                      ]}
                    >
                      <CodeBlockCode id="testscase.value">
                        {testcase.value}
                      </CodeBlockCode>
                    </CodeBlock>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}

              {testcase.stdout ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Standard output</DescriptionListTerm>
                  <DescriptionListDescription>
                    <CodeBlock
                      actions={[
                        <CodeBlockAction>
                          <CopyButton text={testcase.stdout} variant="plain" />
                        </CodeBlockAction>,
                      ]}
                    >
                      <CodeBlockCode id="testscase.stdout">
                        {testcase.stdout}
                      </CodeBlockCode>
                    </CodeBlock>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}

              {testcase.stderr ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Standard error</DescriptionListTerm>
                  <DescriptionListDescription>
                    <CodeBlock
                      actions={[
                        <CodeBlockAction>
                          <CopyButton text={testcase.stderr} variant="plain" />
                        </CodeBlockAction>,
                      ]}
                    >
                      <CodeBlockCode id="testscase.stderr">
                        {testcase.stderr}
                      </CodeBlockCode>
                    </CodeBlock>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
            </DescriptionList>
          </div>
        </div>
      ) : null}
    </div>
  );
}
