import * as React from "react";
import { SadTearIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateHeader,
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
      <EmptyState>
        <EmptyStateHeader
          titleText={<>{title}</>}
          icon={<EmptyStateIcon icon={icon ? icon : SadTearIcon} />}
          headingLevel="h4"
        />
        <EmptyStateBody>{info}</EmptyStateBody>
        <EmptyStateFooter>
          {action && <EmptyStateActions>{action}</EmptyStateActions>}
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
}
