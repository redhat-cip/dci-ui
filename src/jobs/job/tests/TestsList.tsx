import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import Test from "./Test";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { ITest } from "types";

interface TestsListProps {
  tests: ITest[];
}

export default function TestsList({ tests }: TestsListProps) {
  if (isEmpty(tests))
    return (
      <EmptyState title="No tests" info="There is no tests for this job" />
    );
  return (
    <>
      {tests.map((test, i) => (
        <PageSection variant={PageSectionVariants.light} className="mt-xs">
          <Test key={i} test={test} />
        </PageSection>
      ))}
    </>
  );
}
