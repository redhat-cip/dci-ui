import { useListComponentsQuery } from "./componentsApi";
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { useState } from "react";
import {
  getDefaultFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
} from "../api/filters";
import { Filters } from "types";
import TagsFilter from "jobs/toolbar/TagsFilter";
import NameFilter from "jobs/toolbar/NameFilter";

const Categories = ["Name", "Type", "Tag"] as const;

type Category = (typeof Categories)[number];

export default function ComponentsToolbar({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0],
  );

  function clearAllFilters() {
    setCurrentCategory(Categories[0]);
    setFilters(getDefaultFilters());
  }

  const { data } = useListComponentsQuery(filters);
  if (!data) return null;
  const count = data._meta.count;
  return (
    <Toolbar
      id="toolbar-components"
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={clearAllFilters}
    >
      <ToolbarContent>
        <ToolbarGroup>
          <InputGroup>
            <InputGroupItem>
              <Dropdown
                isOpen={isCategoryDropdownOpen}
                onSelect={(_event, index) => {
                  if (index !== undefined) {
                    setCurrentCategory(Categories[index as number]);
                  }
                }}
                onOpenChange={(isOpen: boolean) =>
                  setIsCategoryDropdownOpen(isOpen)
                }
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
              >
                <DropdownList>
                  <DropdownItem value={0} key="Name">
                    Name
                  </DropdownItem>
                  <DropdownItem value={1} key="Type">
                    Type
                  </DropdownItem>
                  <DropdownItem value={2} key="Tag">
                    Tag
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </InputGroupItem>
            <InputGroupItem isFill>
              <NameFilter
                showToolbarItem={currentCategory === "Name"}
                name={filters.display_name}
                onSubmit={(display_name) =>
                  setFilters({
                    ...filters,
                    display_name,
                  })
                }
                onClear={() =>
                  setFilters({
                    ...filters,
                    display_name: null,
                  })
                }
              />
              <NameFilter
                categoryName="Type"
                showToolbarItem={currentCategory === "Type"}
                name={filters.type}
                onSubmit={(type) => setFilters({ ...filters, type })}
                onClear={() => setFilters({ ...filters, type: null })}
              />
              <TagsFilter
                showToolbarItem={currentCategory === "Tag"}
                tags={filters.tags || []}
                onSubmit={(tags) => setFilters({ ...filters, tags })}
              />
            </InputGroupItem>
          </InputGroup>
        </ToolbarGroup>
        <ToolbarGroup style={{ flex: "1" }}>
          <ToolbarItem variant="pagination" align={{ default: "alignRight" }}>
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
  );
}
