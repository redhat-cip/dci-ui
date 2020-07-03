import React from "react";
import { Filters, Status } from "types";
import {
  Select,
  SelectOption,
  ToolbarItem,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  ToolbarGroup,
  ToolbarContent,
  Toolbar,
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  Pagination,
} from "@patternfly/react-core";
import { FilterIcon, SearchIcon } from "@patternfly/react-icons";
import RemotecisFilter from "./RemotecisFilter";
import ProductsFilter from "./ProductsFilter";
import TopicsFilter from "./TopicsFilter";
import { Statuses } from "types";
import TeamsFilter from "./TeamsFilter";
import { useSelector } from "react-redux";
import { getNbOfJobs } from "jobs/jobsSelectors";

type FilterDropdownProps = {
  currentCategory: Category;
  filters: Filters;
  setFilters: (filters: Filters) => void;
};
const FilterDropdown = ({
  currentCategory,
  filters,
  setFilters,
}: FilterDropdownProps) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

type StatusFilterProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

const StatusFilter = ({ filters, setFilters }: StatusFilterProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const clearStatus = () => setFilters({ ...filters, status: null });
  return (
    <ToolbarFilter
      chips={filters.status ? [filters.status] : []}
      deleteChip={clearStatus}
      categoryName="Status"
      showToolbarItem
    >
      <Select
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          delete selection.toString;
          setFilters({ ...filters, status: selection as Status });
        }}
        onClear={clearStatus}
        selections={filters.status || ""}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by status..."
      >
        {Statuses.map((s, index) => (
          <SelectOption key={index} value={s} />
        ))}
      </Select>
    </ToolbarFilter>
  );
};

type TagsFilterProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

const TagsFilter = ({ filters, setFilters }: TagsFilterProps) => {
  const [tag, setTag] = React.useState("");
  return (
    <ToolbarFilter
      chips={filters.tags}
      deleteChip={(key, value) => {
        if (key) {
          setFilters({
            ...filters,
            tags: filters.tags.filter((f) => f !== value),
          });
        }
      }}
      categoryName="Tags"
      showToolbarItem
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (filters.tags.indexOf(tag) == -1) {
            setFilters({
              ...filters,
              tags: filters.tags.concat(tag),
            });
            setTag("");
          }
        }}
      >
        <InputGroup>
          <TextInput
            name="tag"
            id="input-tag"
            type="search"
            aria-label="tag filter"
            onChange={(tag) => setTag(tag)}
            value={tag}
            placeholder="Filter by tag..."
          />
          <Button
            variant={ButtonVariant.control}
            aria-label="search tag button"
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
};

export const Categories = ["Team", "Remoteci", "Product", "Topic"] as const;

export type Category = typeof Categories[number];

type DCIToolbarProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  clearAllFilters: () => void;
};

const DCIToolbar = ({
  filters,
  setFilters,
  clearAllFilters,
}: DCIToolbarProps) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(
    false
  );
  const [currentCategory, setCurrentCategory] = React.useState<Category>(
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
          <ToolbarItem variant="pagination">
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
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default DCIToolbar;
