import {
  Button,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Truncate,
} from "@patternfly/react-core";
import { useState } from "react";
import { ITestCase } from "types";
import { CopyButton } from "ui";

interface TestCaseProps {
  testcase: ITestCase;
  index: number;
}

export default function TestCase({ testcase, index }: TestCaseProps) {
  const [seeDetails, setSeeDetails] = useState(false);
  return (
    <DataListItem aria-labelledby={`testcase-${index}`} isExpanded={seeDetails}>
      <DataListItemRow>
        <DataListToggle
          onClick={() => setSeeDetails(!seeDetails)}
          isExpanded={seeDetails}
          id={`toggle-testcase-${index}`}
          aria-controls={`testcase-expanded-content-${index}`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="testcase-action" width={1}>
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
            </DataListCell>,
            <DataListCell key="testcase-name" width={5}>
              <Button
                size="sm"
                variant="link"
                onClick={() => setSeeDetails(!seeDetails)}
              >
                <Truncate content={`${testcase.classname} ${testcase.name}`} />
              </Button>
            </DataListCell>,
            <DataListCell key="testcase-duration" width={1}>
              {testcase.time} s
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label="testcase"
        id={`expanded-content-${index}`}
        isHidden={!seeDetails}
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
              <DescriptionListGroup key={`${property.name}:${property.value}`}>
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
      </DataListContent>
    </DataListItem>
  );
}
