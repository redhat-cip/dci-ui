import { useState } from "react";
import { IJobFilters } from "types";
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
import { SyncAltIcon } from "@patternfly/react-icons";
import RemotecisFilter from "./RemotecisFilter";
import ProductsFilter from "./ProductsFilter";
import TopicsFilter from "./TopicsFilter";
import TeamsFilter from "./TeamsFilter";
import { useSelector } from "react-redux";
import { getNbOfJobs } from "jobs/jobsSelectors";
import StatusFilter from "./StatusFilter";
import TagsFilter from "./TagsFilter";
import ConfigurationFilter from "./ConfigurationFilter";
import NameFilter from "./NameFilter";

export const Categories = [
  "Team",
  "Remoteci",
  "Product",
  "Topic",
  "Tag",
  "Configuration",
  "Name",
] as const;

export type Category = typeof Categories[number];

type JobsToolbarProps = {
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
  clearAllFilters: () => void;
  refresh: () => void;
};

export default function JobsToolbar({
  filters,
  setFilters,
  clearAllFilters,
  refresh,
}: JobsToolbarProps) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0]
  );
  const nbOfJobs = useSelector(getNbOfJobs);
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
            <TeamsFilter
              showToolbarItem={currentCategory === "Team"}
              team_id={filters.team_id}
              onClear={() => setFilters({ ...filters, team_id: null })}
              onSelect={(team) => setFilters({ ...filters, team_id: team.id })}
            />
            <RemotecisFilter
              showToolbarItem={currentCategory === "Remoteci"}
              remoteci_id={filters.remoteci_id}
              onClear={() => setFilters({ ...filters, remoteci_id: null })}
              onSelect={(remoteci) =>
                setFilters({ ...filters, remoteci_id: remoteci.id })
              }
            />
            <ProductsFilter
              showToolbarItem={currentCategory === "Product"}
              product_id={filters.product_id}
              onClear={() => setFilters({ ...filters, product_id: null })}
              onSelect={(product) =>
                setFilters({ ...filters, product_id: product.id })
              }
            />
            <TopicsFilter
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
        <ToolbarGroup>
          <ToolbarItem>
            <Button
              variant={ButtonVariant.control}
              aria-label="refresh"
              type="button"
              onClick={refresh}
            >
              <SyncAltIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            {nbOfJobs === 0 ? null : (
              <Pagination
                perPage={filters.perPage}
                page={filters.page}
                itemCount={nbOfJobs}
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
