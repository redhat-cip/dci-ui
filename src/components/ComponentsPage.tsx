import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useListComponentsQuery } from "./componentsApi";
import MainPage from "pages/MainPage";
import {
  CopyButton,
  EmptyState,
  Breadcrumb,
  StateLabel,
  InputFilter,
} from "ui";
import { sort } from "services/sort";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Label,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { formatDate } from "services/date";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "../api/filters";
import { Filters } from "types";

const defaultComponentFilters = {
  sort: "-released_at",
};

export default function ComponentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, defaultComponentFilters),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/components${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading } = useListComponentsQuery(filters);
  if (!data) return null;
  const count = data._meta.count;
  return (
    <MainPage
      title="Components"
      description="A component is the main abstraction that describe a Red Hat component (RHEL, OpenStack, Openshift)."
      loading={isLoading}
      empty={data.components.length === 0}
      EmptyComponent={
        <EmptyState
          title="There is no components"
          info="You need some permissions to see components on the user interface. Please contact an administrator"
        />
      }
      Toolbar={
        <Toolbar id="toolbar-components" collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <InputFilter
                  search={filters.display_name || ""}
                  placeholder="Search a component"
                  onSearch={(display_name) => {
                    setFilters({
                      ...filters,
                      display_name,
                    });
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup style={{ flex: "1" }}>
              <ToolbarItem
                variant="pagination"
                align={{ default: "alignRight" }}
              >
                {count === 0 ? null : (
                  <Pagination
                    perPage={filters.limit}
                    page={offsetAndLimitToPage(filters.offset, filters.limit)}
                    itemCount={count}
                    onSetPage={(e, newPage) => {
                      setFilters({
                        ...filters,
                        offset: pageAndLimitToOffset(newPage, filters.limit),
                      });
                    }}
                    onPerPageSelect={(e, newPerPage) => {
                      setFilters({ ...filters, limit: newPerPage });
                    }}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      }
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Components" }]}
        />
      }
    >
      <Table aria-label="Components label" variant="compact">
        <Thead>
          <Tr>
            <Th className="text-center pf-m-width-10">ID</Th>
            <Th className="pf-m-width-20">Name</Th>
            <Th className="pf-m-width-40">Tags</Th>
            <Th className="pf-m-width-10">Released at</Th>
            <Th className="pf-m-width-10">Type</Th>
            <Th className="pf-m-width-10">State</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.components.map((component) => (
            <Tr key={`${component.id}.${component.etag}`}>
              <Td className="text-center">
                <CopyButton text={component.id} />
              </Td>
              <Td>
                <Link
                  to={`/topics/${component.topic_id}/components/${component.id}`}
                >
                  {component.display_name}
                </Link>
              </Td>

              <Td>
                <span>
                  {component.tags !== null &&
                    component.tags.length !== 0 &&
                    sort(component.tags).map((tag, i) => (
                      <Label
                        isCompact
                        key={i}
                        className="pf-v5-u-mt-xs pf-v5-u-mr-xs"
                        color="blue"
                      >
                        {tag}
                      </Label>
                    ))}
                </span>
              </Td>
              <Td>
                <span title={component.released_at}>
                  {formatDate(component.released_at, DateTime.DATE_MED)}
                </span>
              </Td>
              <Td>
                <Label isCompact>{component.type}</Label>
              </Td>
              <Td>
                <StateLabel isCompact state={component.state} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </MainPage>
  );
}
