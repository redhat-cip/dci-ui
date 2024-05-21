import { useState } from "react";
import { Filters, JobsTableListColumn } from "types";
import {
  ToolbarItem,
  ToolbarGroup,
  ToolbarContent,
  Toolbar,
  Pagination,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import {
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core/deprecated";
import {
  ArrowsAltVIcon,
  ListIcon,
  SyncAltIcon,
  TableIcon,
} from "@patternfly/react-icons";
import RemoteciToolbarFilter from "./RemoteciToolbarFilter";
import ProductToolbarFilter from "./ProductToolbarFilter";
import TopicToolbarFilter from "./TopicToolbarFilter";
import TeamToolbarFilter from "./TeamToolbarFilter";
import StatusToolbarFilter from "./StatusToolbarFilter";
import ListToolbarFilter from "./ListToolbarFilter";
import TextInputToolbarFilter from "./TextInputToolbarFilter";
import { useHotkeys } from "react-hotkeys-hook";
import QLToolbar from "./QLToolbar";
import TableViewColumnsSelect from "./TableViewColumnsSelect";
import { offsetAndLimitToPage, pageAndLimitToOffset } from "api/filters";
import { isUUID } from "services/utils";

export const Categories = [
  "Remoteci",
  "Team",
  "Product",
  "Topic",
  "Tag",
  "Config",
  "Name",
  "Pipeline id",
] as const;

export type Category = (typeof Categories)[number];

type JobsToolbarProps = {
  jobsCount: number;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  clearAllFilters: () => void;
  refresh: () => void;
  tableViewActive: boolean;
  setTableViewActive: (tableViewActive: boolean) => void;
  tableViewColumns: JobsTableListColumn[];
  setTableViewColumns: (tableViewColumns: JobsTableListColumn[]) => void;
};

export default function JobsToolbar({
  jobsCount,
  filters,
  setFilters,
  clearAllFilters,
  refresh,
  tableViewActive,
  setTableViewActive,
  tableViewColumns,
  setTableViewColumns,
}: JobsToolbarProps) {
  const [showQLToolbar, setShowQLToolbar] = useState(filters.query !== null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0],
  );

  useHotkeys("ctrl+shift+q", () => setShowQLToolbar(!showQLToolbar), [
    showQLToolbar,
  ]);

  return (
    <Toolbar
      id="toolbar-jobs"
      clearAllFilters={clearAllFilters}
      collapseListedFiltersBreakpoint="xl"
    >
      <ToolbarContent>
        {!showQLToolbar && (
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Dropdown
                onSelect={(event) => {
                  if (event) {
                    const link = event.target as HTMLElement;
                    const selectedCategory = Categories.find(
                      (category) => category === link.innerText,
                    );
                    if (selectedCategory) {
                      setCurrentCategory(selectedCategory);
                    }
                  }
                  setIsCategoryDropdownOpen(false);
                }}
                position={DropdownPosition.left}
                toggle={
                  <DropdownToggle
                    onToggle={(_event, isOpen) =>
                      setIsCategoryDropdownOpen(isOpen)
                    }
                    style={{ width: "100%" }}
                  >
                    {currentCategory}
                  </DropdownToggle>
                }
                isOpen={isCategoryDropdownOpen}
                dropdownItems={Categories.map((category) => (
                  <DropdownItem key={category}>{category}</DropdownItem>
                ))}
                style={{ width: "100%" }}
              ></Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <TeamToolbarFilter
                showToolbarItem={currentCategory === "Team"}
                id={filters.team_id}
                onClear={() => setFilters({ ...filters, team_id: null })}
                onSelect={(team) =>
                  setFilters({ ...filters, team_id: team.id })
                }
              />
              <RemoteciToolbarFilter
                showToolbarItem={currentCategory === "Remoteci"}
                id={filters.remoteci_id}
                onClear={() => setFilters({ ...filters, remoteci_id: null })}
                onSelect={(remoteci) =>
                  setFilters({ ...filters, remoteci_id: remoteci.id })
                }
              />
              <ProductToolbarFilter
                showToolbarItem={currentCategory === "Product"}
                id={filters.product_id}
                onClear={() => setFilters({ ...filters, product_id: null })}
                onSelect={(product) =>
                  setFilters({ ...filters, product_id: product.id })
                }
              />
              <TopicToolbarFilter
                showToolbarItem={currentCategory === "Topic"}
                id={filters.topic_id}
                onClear={() => setFilters({ ...filters, topic_id: null })}
                onSelect={(topic) =>
                  setFilters({ ...filters, topic_id: topic.id })
                }
              />
              <ListToolbarFilter
                showToolbarItem={currentCategory === "Tag"}
                categoryName="Tag"
                placeholderText="Search by tag"
                items={filters.tags ?? []}
                onSubmit={(tags) => setFilters({ ...filters, tags })}
              />
              <TextInputToolbarFilter
                showToolbarItem={currentCategory === "Config"}
                categoryName="Config"
                name={filters.configuration}
                onSubmit={(configuration) =>
                  setFilters({ ...filters, configuration })
                }
                onClear={() => setFilters({ ...filters, configuration: null })}
              />
              <TextInputToolbarFilter
                categoryName="Name"
                showToolbarItem={currentCategory === "Name"}
                name={filters.name}
                onSubmit={(name) => setFilters({ ...filters, name })}
                onClear={() => setFilters({ ...filters, name: null })}
              />
              <TextInputToolbarFilter
                categoryName="Pipeline id"
                showToolbarItem={currentCategory === "Pipeline id"}
                name={filters.pipeline_id}
                onSubmit={(pipeline_id) => {
                  if (isUUID(pipeline_id)) {
                    setFilters({ ...filters, pipeline_id });
                  }
                }}
                onClear={() => setFilters({ ...filters, pipeline_id: null })}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {!showQLToolbar && (
          <ToolbarGroup>
            <ToolbarItem>
              <StatusToolbarFilter
                status={filters.status}
                onSelect={(status) => setFilters({ ...filters, status })}
                onClear={() => setFilters({ ...filters, status: null })}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {showQLToolbar && (
          <>
            <QLToolbar
              query={filters.query}
              onSearch={(query) => setFilters({ ...filters, query })}
              onClear={() => setFilters({ ...filters, query: null })}
            />
            <ToolbarItem variant="separator" />
          </>
        )}
        <ToolbarGroup variant="icon-button-group">
          <ToolbarItem>
            <Button
              variant={ButtonVariant.plain}
              aria-label="refresh"
              type="button"
              onClick={refresh}
            >
              <SyncAltIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant={ButtonVariant.plain}
              aria-label={tableViewActive ? "Table view" : "List view"}
              type="button"
              onClick={() => setTableViewActive(!tableViewActive)}
            >
              {tableViewActive ? (
                <>
                  <TableIcon />
                  <ArrowsAltVIcon />
                </>
              ) : (
                <>
                  <ListIcon />
                  <ArrowsAltVIcon />
                </>
              )}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        {tableViewActive && (
          <ToolbarItem>
            <TableViewColumnsSelect
              columns={tableViewColumns}
              onSelect={setTableViewColumns}
            />
          </ToolbarItem>
        )}
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem variant="pagination" align={{ default: "alignRight" }}>
            {jobsCount === 0 ? null : (
              <Pagination
                perPage={filters.limit}
                page={offsetAndLimitToPage(filters.offset, filters.limit)}
                itemCount={jobsCount}
                onSetPage={(e, newPage) =>
                  setFilters({
                    ...filters,
                    offset: pageAndLimitToOffset(newPage, filters.limit),
                  })
                }
                onPerPageSelect={(e, newPerPage) => {
                  setFilters({ ...filters, limit: newPerPage });
                }}
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
}
