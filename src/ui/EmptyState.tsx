import React from "react";
import { SadTearIcon } from "@patternfly/react-icons";
import {
  TextContent,
  Text,
  TextVariants,
  Bullseye,
} from "@patternfly/react-core";

interface EmptyStateProps {
  title: string;
  info: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, info, icon }: EmptyStateProps) {
  return (
    <Bullseye>
      <TextContent className="text-center">
        {icon ? icon : <SadTearIcon size="lg" />}
        <Text component={TextVariants.h1}>{title}</Text>
        <Text component={TextVariants.h3}>{info}</Text>
      </TextContent>
    </Bullseye>
  );
}
