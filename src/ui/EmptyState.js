import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateInfo,
  EmptyStateAction
} from "patternfly-react";
import styled from "styled-components";
import { Colors } from "../ui";

const DCIEmptyState = styled(EmptyState)`
  background-color: ${Colors.white};
  border: none;
`;

export default function({ title, info, button, icon }) {
  return (
    <DCIEmptyState>
      {icon ? icon : null}
      {button ? <EmptyStateIcon /> : null}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateInfo>{info}</EmptyStateInfo>
      {button ? <EmptyStateAction>{button}</EmptyStateAction> : null}
    </DCIEmptyState>
  );
}
