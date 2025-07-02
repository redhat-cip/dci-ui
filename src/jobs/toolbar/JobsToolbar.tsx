import { useState } from "react";
import type { Filters, JobsTableListColumn } from "types";
import {
  ToolbarItem,
  ToolbarGroup,
  ToolbarContent,
  Toolbar,
  Pagination,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
} from "@patternfly/react-core";
import { SyncAltIcon } from "@patternfly/react-icons";
import ProductToolbarFilter from "products/form/ProductToolbarFilter";
import TopicToolbarFilter from "topics/form/TopicToolbarFilter";
import TeamToolbarFilter from "teams/form/TeamToolbarFilter";
import StatusToolbarFilter from "./StatusToolbarFilter";
import ListToolbarFilter from "./ListToolbarFilter";
import TextInputToolbarFilter from "./TextInputToolbarFilter";
import { useHotkeys } from "react-hotkeys-hook";
import QLToolbar from "./QLToolbar";
import TableViewColumnsSelect from "./TableViewColumnsSelect";
import { offsetAndLimitToPage, pageAndLimitToOffset } from "services/filters";
import { isUUID } from "services/utils";
import RemoteciToolbarFilter from "remotecis/form/RemoteciToolbarFilter";

const Categories = [
  "Remoteci",
  "Team",
  "Product",
  "Topic",
  "Tag",
  "Config",
  "Name",
  "Pipeline id",
] as const;

type Category = (typeof Categories)[number];

type JobsToolbarProps = {
  jobsCount: number;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  clearAllFilters: () => void;
  refresh: () => void;
  tableViewColumns: JobsTableListColumn[];
  setTableViewColumns: (tableViewColumns: JobsTableListColumn[]) => void;
};

export default function JobsToolbar({
  jobsCount,
  filters,
  setFilters,
  clearAllFilters,
  refresh,
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
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                    isExpanded={isCategoryDropdownOpen}
                  >
                    {currentCategory}
                  </MenuToggle>
                )}
                isOpen={isCategoryDropdownOpen}
              >
                <DropdownList>
                  {Categories.map((category) => (
                    <DropdownItem key={category}>{category}</DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
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
                value={filters.configuration}
                onSubmit={(configuration) =>
                  setFilters({ ...filters, configuration })
                }
                onClear={() => setFilters({ ...filters, configuration: null })}
              />
              <TextInputToolbarFilter
                categoryName="Name"
                showToolbarItem={currentCategory === "Name"}
                value={filters.name}
                onSubmit={(name) => setFilters({ ...filters, name })}
                onClear={() => setFilters({ ...filters, name: null })}
              />
              <TextInputToolbarFilter
                categoryName="Pipeline id"
                showToolbarItem={currentCategory === "Pipeline id"}
                value={filters.pipeline_id}
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
        <ToolbarItem>
          <TableViewColumnsSelect
            columns={tableViewColumns}
            onSelect={setTableViewColumns}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Button
            icon={<SyncAltIcon />}
            variant={ButtonVariant.plain}
            aria-label="refresh"
            type="button"
            onClick={refresh}
          />
        </ToolbarItem>
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
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
