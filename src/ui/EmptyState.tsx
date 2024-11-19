import * as React from "react";
import { SadTearIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
} from "@patternfly/react-core";

interface EmptyStateProps {
  title: string;
  info: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
}

export default function DCIEmptyState({
  title,
  info,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Bullseye>
      <EmptyState
        headingLevel="h4"
        icon={icon ? icon : SadTearIcon}
        titleText={<>{title}</>}
      >
        <EmptyStateBody>{info}</EmptyStateBody>
        <EmptyStateFooter>
          {action && <EmptyStateActions>{action}</EmptyStateActions>}
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
}
