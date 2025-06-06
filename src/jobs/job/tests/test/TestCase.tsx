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
  PlusIcon,
  ThumbsUpIcon,
  TrashIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { Tbody, Td, Tr } from "@patternfly/react-table";
import { humanizeDuration } from "services/date";
import { useEffect, useRef, useState } from "react";
import { ITestCase, ITestCaseActionState, ITestCaseActionType } from "types";
import { CopyButton } from "ui";

function TestCaseIcon({ action }: { action: ITestCaseActionType }) {
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
    default:
      return (
        <Label isCompact color="grey">
          Unknown
        </Label>
      );
  }
}

export function TestCaseState({
  state,
  ...props
}: {
  state: ITestCaseActionState;
  [x: string]: any;
}) {
  switch (state) {
    case "ADDED":
      return (
        <Label isCompact icon={<PlusIcon />} color="blue" {...props}>
          New
        </Label>
      );
    case "RECOVERED":
      return (
        <Label isCompact icon={<ThumbsUpIcon />} color="green" {...props}>
          Fix
        </Label>
      );
    case "REGRESSED":
      return (
        <Label isCompact icon={<WarningTriangleIcon />} color="red" {...props}>
          regression
        </Label>
      );
    case "REMOVED":
      return (
        <Label isCompact icon={<TrashIcon />} color="orange" {...props}>
          removed
        </Label>
      );
    case "UNCHANGED":
      return null;
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
        <Td>
          <span
            style={{
              textDecoration:
                testcase.state === "REMOVED" ? "line-through" : "none",
            }}
          >
            {testcase.name}
          </span>
        </Td>
        <Td textCenter modifier="fitContent">
          <TestCaseState state={testcase.state} />
        </Td>
        <Td textCenter modifier="fitContent">
          <TestCaseIcon action={testcase.action} />
        </Td>
        <Td textCenter modifier="fitContent">
          <Label isCompact title={`${testcase.time} seconds`}>
            {humanizeDuration(testcase.time, { maxDecimalPoints: 2 })}
          </Label>
        </Td>
        <Td modifier="fitContent">{testcase.classname}</Td>
        <Td>{testcase.type}</Td>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <Td></Td>
        <Td colSpan={99}>
          <DescriptionList
            columnModifier={{
              default: "2Col",
            }}
          >
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
                      <CodeBlockAction key="copy">
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
