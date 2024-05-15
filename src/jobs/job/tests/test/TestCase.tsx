import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from "@patternfly/react-core";
import { Td, Tr } from "@patternfly/react-table";
import { useState } from "react";
import { ITestCase, ITestCaseActionType } from "types";
import { CopyButton } from "ui";

interface TestCaseProps {
  testcase: ITestCase;
  index: number;
}
export function getTestCaseIcon(action: ITestCaseActionType) {
  switch (action) {
    case "skipped":
      return (
        <Label isCompact color="orange">
          Skip
        </Label>
      );
    case "failure":
      return (
        <Label isCompact color="red">
          Failure
        </Label>
      );
    case "error":
      return (
        <Label isCompact color="red">
          Error
        </Label>
      );
    case "success":
      return (
        <Label isCompact color="green">
          Pass
        </Label>
      );
  }
}

export default function TestCase({ testcase, index }: TestCaseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Tr>
        <Td
          expand={{
            rowIndex: index,
            isExpanded,
            onToggle: () => setIsExpanded(!isExpanded),
            expandId: `${testcase.classname}:${testcase.name}:${index}`,
          }}
        />
        <Td>{getTestCaseIcon(testcase.action)}</Td>
        <Td>{testcase.name}</Td>
        <Td>{testcase.time} s</Td>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <Td></Td>
        <Td></Td>
        <Td colSpan={3} className="pf-v5-u-py-sm">
          <DescriptionList
            columnModifier={{
              default: "2Col",
            }}
          >
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
        </Td>
      </Tr>
    </>
  );
}
