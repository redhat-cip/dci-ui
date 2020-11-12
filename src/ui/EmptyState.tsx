import React from "react";
import { SadTearIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from "@patternfly/react-core";

interface EmptyStateProps {
  title: string;
  info: string;
  icon?: React.ComponentType<any>;
}

export default function DCIEmptyState({ title, info, icon }: EmptyStateProps) {
  return (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={icon ? icon : SadTearIcon} />
        <Title headingLevel="h4" size="lg">
          {title}
        </Title>
        <EmptyStateBody>{info}</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
}
