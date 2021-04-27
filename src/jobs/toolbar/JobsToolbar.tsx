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
import { FilterIcon, SyncAltIcon } from "@patternfly/react-icons";
import RemotecisFilter from "./RemotecisFilter";
import ProductsFilter from "./ProductsFilter";
import TopicsFilter from "./TopicsFilter";
import TeamsFilter from "./TeamsFilter";
import { useSelector } from "react-redux";
import { getNbOfJobs } from "jobs/jobsSelectors";
import StatusFilter from "./StatusFilter";
import TagsFilter from "./TagsFilter";

type FilterDropdownProps = {
  currentCategory: Category;
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
};

function FilterDropdown({
  currentCategory,
  filters,
  setFilters,
}: FilterDropdownProps) {
  return (
    <>
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
        onSelect={(topic) => setFilters({ ...filters, topic_id: topic.id })}
      />
    </>
  );
}

export const Categories = ["Team", "Remoteci", "Product", "Topic"] as const;

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
                  <FilterIcon /> {currentCategory}
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
            <FilterDropdown
              currentCategory={currentCategory as Category}
              filters={filters}
              setFilters={setFilters}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <StatusFilter filters={filters} setFilters={setFilters} />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <TagsFilter filters={filters} setFilters={setFilters} />
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
