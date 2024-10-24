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
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@patternfly/react-icons";
import { Tbody, Td, Tr } from "@patternfly/react-table";
import { useEffect, useRef, useState } from "react";
import { ITestCase, ITestCaseActionType } from "types";
import { CopyButton } from "ui";

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

interface TestCaseProps {
  isExpanded?: boolean;
  expand: (isExpanded: boolean) => void;
  testcase: ITestCase;
  index: number;
}

export default function TestCase({
  testcase,
  index,
  expand,
  isExpanded: defaultIsExpanded = false,
}: TestCaseProps) {
  const divRef = useRef<HTMLTableRowElement>(null);
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);

  useEffect(() => {
    if (defaultIsExpanded) {
      divRef.current?.scrollIntoView();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tbody isExpanded={isExpanded}>
      <Tr ref={divRef}>
        <Td
          expand={{
            rowIndex: index,
            isExpanded,
            onToggle: () => {
              const newIsExpanded = !isExpanded;
              setIsExpanded(newIsExpanded);
              expand(newIsExpanded);
            },
            expandId: `${testcase.classname}:${testcase.name}:${index}`,
          }}
        />
        <Td className="text-center">{getTestCaseIcon(testcase.action)}</Td>
        <Td className="text-center">
          {testcase.regression && (
            <Label isCompact icon={<ExclamationCircleIcon />} color="red">
              regression
            </Label>
          )}
          {testcase.successfix && (
            <Label isCompact icon={<CheckCircleIcon />} color="green">
              fix
            </Label>
          )}
        </Td>
        <Td>{testcase.name}</Td>
        <Td className="text-center">{testcase.time} s</Td>
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
    </Tbody>
  );
}
