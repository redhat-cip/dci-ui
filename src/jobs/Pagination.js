import React, { Component } from "react";
import {
  Filter,
  FormGroup,
  PaginationRowBack,
  PaginationRowForward
} from "patternfly-react";
import styled from "styled-components";

const FormGroupPagination = styled(FormGroup)`
  display: flex;
  background-color: transparent;
  align-items: center;
  border: none;
  & > .pagination {
    margin: 0;
  }
`;

const PageInfo = styled.span`
  margin: 0 1em;
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
      <Filter>
        <FormGroupPagination>
          <PageInfo>{`${itemsStart} - ${itemsEnd} of ${count}`}</PageInfo>
          <PaginationRowBack
            page={page}
            messagesFirstPage="First Page"
            messagesPreviousPage="Previous Page"
            onFirstPage={() => goTo(1)}
            onPreviousPage={() => goTo(page - 1)}
          />
          <PageInfo>{`${page} of ${nbPages}`}</PageInfo>
          <PaginationRowForward
            page={page}
            amountOfPages={nbPages}
            messagesNextPage="Next Page"
            messagesLastPage="Last Page"
            onNextPage={() => goTo(page + 1)}
            onLastPage={() => goTo(nbPages)}
          />
        </FormGroupPagination>
      </Filter>
    );
  }
}
