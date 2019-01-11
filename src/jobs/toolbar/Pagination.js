import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "@patternfly/react-core";
import {
  AngleLeftIcon,
  AngleRightIcon,
  AngleDoubleLeftIcon,
  AngleDoubleRightIcon
} from "@patternfly/react-icons";

const PaginationBlock = styled.div`
  .pf-c-dropdown {
    margin-right: 2em;
  }
  .pf-c-dropdown__toggle::before {
    border: none;
  }
  .pf-c-dropdown__menu {
    border-top: 1px solid #007bba;
  }
`;

export default class Pagination extends Component {
  render() {
    const { pagination, count, goTo } = this.props;
    if (!count) return null;
    const { page, perPage } = pagination;
    const nbPages = Math.ceil(count / perPage);
    const itemsStart = (page - 1) * perPage + 1;
    const itemsEnd = page * perPage > count ? count : page * perPage;
    return (
      <PaginationBlock>
        <span>{`${itemsStart} - ${itemsEnd} of ${count}`}</span>
        <Button
          variant="plain"
          aria-label="select first page"
          onClick={() => goTo(1)}
        >
          <AngleDoubleLeftIcon />
        </Button>
        <Button
          variant="plain"
          aria-label="select previous page"
          onClick={() => goTo(page - 1)}
        >
          <AngleLeftIcon />
        </Button>
        <span>{`${page} of ${nbPages}`}</span>
        <Button
          variant="plain"
          aria-label="select first page"
          onClick={() => goTo(page + 1)}
        >
          <AngleRightIcon />
        </Button>
        <Button
          variant="plain"
          aria-label="select next page"
          onClick={() => goTo(nbPages)}
        >
          <AngleDoubleRightIcon />
        </Button>
      </PaginationBlock>
    );
  }
}
