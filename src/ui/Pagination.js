import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import {
  AngleLeftIcon,
  AngleRightIcon,
  AngleDoubleLeftIcon,
  AngleDoubleRightIcon
} from "@patternfly/react-icons";

export default class Pagination extends Component {
  render() {
    const { pagination, count, goTo, items, ...rest } = this.props;
    if (!count) return null;
    const { page, perPage } = pagination;
    const nbPages = Math.ceil(count / perPage);
    const itemsStart = (page - 1) * perPage + 1;
    const itemsEnd = page * perPage > count ? count : page * perPage;
    return (
      <div class="pf-c-pagination" {...rest}>
        <div class="pf-c-pagination__total-items">{`${count} ${items}`}</div>
        <div class="pf-c-options-menu">
          <span id="pagination-options-menu-top-example-label" hidden>
            {`${items} per page`}
          </span>
          <div class="pf-c-options-menu__toggle pf-m-text pf-m-plain">
            <span class="pf-c-options-menu__toggle-text">
              <b>
                {itemsStart} - {itemsEnd}
              </b>{" "}
              of <b>{count}</b> {items}
            </span>
          </div>
        </div>
        <nav class="pf-c-pagination__nav" aria-label="pagination">
          <Button
            variant="plain"
            aria-label="Go to first page"
            onClick={() => goTo(1)}
            isDisabled={page === 1}
          >
            <AngleDoubleLeftIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Go to previous page"
            onClick={() => goTo(page - 1)}
            isDisabled={page === 1}
          >
            <AngleLeftIcon />
          </Button>
          <div
            class="pf-c-pagination__nav-page-select"
            aria-label={`Current page ${page} of ${nbPages}`}
          >
            <span>{`${page} of ${nbPages}`}</span>
          </div>
          <Button
            variant="plain"
            aria-label="Go to next page"
            onClick={() => goTo(page + 1)}
            isDisabled={page === nbPages}
          >
            <AngleRightIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Go to last page"
            onClick={() => goTo(nbPages)}
            isDisabled={page === nbPages}
          >
            <AngleDoubleRightIcon />
          </Button>
        </nav>
      </div>
    );
  }
}
