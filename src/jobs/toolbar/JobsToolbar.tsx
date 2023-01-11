import { useState } from "react";
import { IJobFilters, JobsTableListColumn } from "types";
import {
  ToolbarItem,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  ToolbarGroup,
  ToolbarContent,
  Toolbar,
  Pagination,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import {
  ArrowsAltVIcon,
  ListIcon,
  SyncAltIcon,
  TableIcon,
} from "@patternfly/react-icons";
import RemoteciFilter from "./RemoteciFilter";
import ProductFilter from "./ProductFilter";
import TopicFilter from "./TopicFilter";
import TeamFilter from "./TeamFilter";
import StatusFilter from "./StatusFilter";
import TagsFilter from "./TagsFilter";
import ConfigurationFilter from "./ConfigurationFilter";
import NameFilter from "./NameFilter";
import TableViewColumnsFilter from "jobs/tableView/TableViewColumnsFilter";

export const Categories = [
  "Remoteci",
  "Team",
  "Product",
  "Topic",
  "Tag",
  "Configuration",
  "Name",
] as const;

export type Category = typeof Categories[number];

type JobsToolbarProps = {
  jobsCount: number;
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0]
  );
  return (
    <Toolbar
      id="toolbar-jobs"
      clearAllFilters={clearAllFilters}
      collapseListedFiltersBreakpoint="xl"
    >
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <Dropdown
              onSelect={(event) => {
                if (event) {
                  const link = event.target as HTMLElement;
                  const selectedCategory = Categories.find(
                    (category) => category === link.innerText
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
                  onToggle={(isOpen) => setIsCategoryDropdownOpen(isOpen)}
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
            <TeamFilter
              showToolbarItem={currentCategory === "Team"}
              team_id={filters.team_id}
              onClear={() => setFilters({ ...filters, team_id: null })}
              onSelect={(team) => setFilters({ ...filters, team_id: team.id })}
            />
            <RemoteciFilter
              showToolbarItem={currentCategory === "Remoteci"}
              remoteci_id={filters.remoteci_id}
              onClear={() => setFilters({ ...filters, remoteci_id: null })}
              onSelect={(remoteci) =>
                setFilters({ ...filters, remoteci_id: remoteci.id })
              }
            />
            <ProductFilter
              showToolbarItem={currentCategory === "Product"}
              product_id={filters.product_id}
              onClear={() => setFilters({ ...filters, product_id: null })}
              onSelect={(product) =>
                setFilters({ ...filters, product_id: product.id })
              }
            />
            <TopicFilter
              showToolbarItem={currentCategory === "Topic"}
              topic_id={filters.topic_id}
              onClear={() => setFilters({ ...filters, topic_id: null })}
              onSelect={(topic) =>
                setFilters({ ...filters, topic_id: topic.id })
              }
            />
            <TagsFilter
              showToolbarItem={currentCategory === "Tag"}
              tags={filters.tags}
              onSubmit={(tags) => setFilters({ ...filters, tags })}
            />
            <ConfigurationFilter
              showToolbarItem={currentCategory === "Configuration"}
              configuration={filters.configuration}
              onClear={() => setFilters({ ...filters, configuration: null })}
              onSubmit={(configuration) =>
                setFilters({ ...filters, configuration })
              }
            />
            <NameFilter
              showToolbarItem={currentCategory === "Name"}
              name={filters.name}
              onSubmit={(name) => setFilters({ ...filters, name })}
              onClear={() => setFilters({ ...filters, name: null })}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <StatusFilter
              status={filters.status}
              onSelect={(status) => setFilters({ ...filters, status })}
              onClear={() => setFilters({ ...filters, status: null })}
            />
          </ToolbarItem>
        </ToolbarGroup>
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
          <ToolbarGroup>
            <ToolbarItem>
              <TableViewColumnsFilter
                columns={tableViewColumns}
                onSelect={setTableViewColumns}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            {jobsCount === 0 ? null : (
              <Pagination
                perPage={filters.perPage}
                page={filters.page}
                itemCount={jobsCount}
                onSetPage={(e, page) =>
                  setFilters({
                    ...filters,
                    page,
                  })
                }
                onPerPageSelect={(e, perPage) =>
                  setFilters({
                    ...filters,
                    perPage,
                  })
                }
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
}
