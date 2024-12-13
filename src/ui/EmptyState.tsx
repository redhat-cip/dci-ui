import * as React from "react";
import { SearchIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
} from "@patternfly/react-core";

interface EmptyStateProps {
  title: string;
  info?: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
}

export default function DCIEmptyState({
  title,
  info = "Please contact a Distributed CI administrator",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Bullseye>
      <EmptyState
        icon={icon ? icon : SearchIcon}
        titleText={title}
        headingLevel="h4"
      >
        <EmptyStateBody>{info}</EmptyStateBody>
        {action && (
          <EmptyStateFooter>
            <EmptyStateActions>{action}</EmptyStateActions>
          </EmptyStateFooter>
        )}
      </EmptyState>
    </Bullseye>
  );
}
