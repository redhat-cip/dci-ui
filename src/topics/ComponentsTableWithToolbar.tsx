import { useEffect, useState, useCallback } from "react";
import { fetchComponents } from "./topicsActions";
import {
  Card,
  CardBody,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  CardTitle,
  Bullseye,
} from "@patternfly/react-core";
import { EmptyState, CopyButton, BlinkLogo, StateLabel } from "ui";
import { IComponent, IEnhancedTopic } from "types";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  buildWhereFromSearch,
  defaultComponentsFilters,
  IComponentsFilters,
  parseWhereFromSearch,
} from "search/where";
import { sort, sortByNewestFirst } from "services/sort";
import NameFilter from "jobs/toolbar/NameFilter";
import TagsFilter from "jobs/toolbar/TagsFilter";
import { formatDate } from "services/date";
import { DateTime } from "luxon";

export function findChannelInTags(tags: string[] | undefined | null) {
  if (!tags) {
    return "";
  }

  const channelsOrdered = ["nightly", "candidate", "milestone"];

  let maxWeight = 0;
  let channel = null;

  for (var tag of tags) {
    const tagIndex = channelsOrdered.indexOf(tag);
    if (tagIndex >= maxWeight) {
      maxWeight = tagIndex;
      channel = channelsOrdered[tagIndex];
    }
  }

  return channel;
}

interface ComponentTableProps {
  topic_id: string;
  components: IComponent[];
  onTagClicked: (tag: string) => void;
  onTypeClicked: (type: string) => void;
}

function RHELComponentsTable({
  topic_id,
  components,
  onTagClicked,
  onTypeClicked,
}: ComponentTableProps) {
  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th className="text-center pf-m-width-10">ID</th>
          <th className="pf-m-width-40">Name</th>
          <th className="pf-m-width-10">Channel</th>
          <th className="pf-m-width-10">Kernel</th>
          <th className="pf-m-width-10">Released at</th>
          <th className="pf-m-width-10">Type</th>
          <th className="pf-m-width-10">State</th>
        </tr>
      </thead>
      <tbody>
        {sortByNewestFirst(components, "released_at").map((component) => {
          const kernel = component.tags.find((tag) =>
            tag.toLowerCase().startsWith("kernel")
          );

          const channel = findChannelInTags(component.tags);

          return (
            <tr key={`${component.id}.${component.etag}`}>
              <td className="text-center">
                <CopyButton text={component.id} />
              </td>
              <td>
                <Link to={`/topics/${topic_id}/components/${component.id}`}>
                  {component.display_name}
                </Link>
              </td>

              <td>
                {channel !== null && (
                  <Label
                    isCompact
                    className="mt-xs mr-xs pointer"
                    color="blue"
                    onClick={() => {
                      onTagClicked(channel);
                    }}
                  >
                    {channel}
                  </Label>
                )}
              </td>
              <td>
                {kernel !== undefined && (
                  <Label
                    isCompact
                    className="mt-xs mr-xs pointer"
                    color="blue"
                    onClick={() => {
                      onTagClicked(kernel);
                    }}
                  >
                    {kernel.replace("kernel:", "")}
                  </Label>
                )}
              </td>
              <td>{formatDate(component.released_at, DateTime.DATE_MED)}</td>
              <td>
                <Label
                  isCompact
                  className="pointer"
                  onClick={() => {
                    onTypeClicked(component.type);
                  }}
                >
                  {component.type}
                </Label>
              </td>
              <td>
                <StateLabel isCompact state={component.state} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DefaultComponentsTable({
  topic_id,
  components,
  onTagClicked,
  onTypeClicked,
}: ComponentTableProps) {
  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th className="text-center pf-m-width-10">ID</th>
          <th className="pf-m-width-20">Name</th>
          <th className="pf-m-width-40">Tags</th>
          <th className="pf-m-width-10">Released at</th>
          <th className="pf-m-width-10">Type</th>
          <th className="pf-m-width-10">State</th>
        </tr>
      </thead>
      <tbody>
        {sortByNewestFirst(components, "released_at").map((component) => (
          <tr key={`${component.id}.${component.etag}`}>
            <td className="text-center">
              <CopyButton text={component.id} />
            </td>
            <td>
              <Link to={`/topics/${topic_id}/components/${component.id}`}>
                {component.display_name}
              </Link>
            </td>

            <td>
              <span>
                {component.tags !== null &&
                  component.tags.length !== 0 &&
                  sort(component.tags).map((tag, i) => (
                    <Label
                      isCompact
                      key={i}
                      className="mt-xs mr-xs pointer"
                      color="blue"
                      onClick={() => {
                        onTagClicked(tag);
                      }}
                    >
                      {tag}
                    </Label>
                  ))}
              </span>
            </td>
            <td>{formatDate(component.released_at, DateTime.DATE_MED)}</td>
            <td>
              <Label
                isCompact
                className="pointer"
                onClick={() => {
                  onTypeClicked(component.type);
                }}
              >
                {component.type}
              </Label>
            </td>
            <td>
              <StateLabel isCompact state={component.state} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Categories = ["Name", "Type", "Tag"] as const;

type Category = (typeof Categories)[number];

export default function ComponentsTableWithToolbar({
  topic,
}: {
  topic: IEnhancedTopic;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState<IComponent[]>([]);

  const [filters, setFilters] = useState<IComponentsFilters>(
    parseWhereFromSearch(location.search)
  );

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0]
  );

  const fetchComponentsCallback = useCallback(() => {
    setIsLoading(true);
    fetchComponents(topic.id, buildWhereFromSearch(filters))
      .then((response) => {
        setComponents(response.data.components);
      })
      .finally(() => setIsLoading(false));
  }, [topic.id, filters]);

  useEffect(() => {
    const where = buildWhereFromSearch(filters);
    navigate(`/topics/${topic.id}/components${where}`, { replace: true });
  }, [navigate, topic.id, filters]);

  useEffect(() => {
    fetchComponentsCallback();
  }, [fetchComponentsCallback]);

  function clearAllFilters() {
    setFilters({ ...defaultComponentsFilters });
  }

  const isSearch =
    filters.display_name !== null ||
    filters.type !== null ||
    filters.tags.length > 0;

  const ComponentsTable = topic.name.toLowerCase().startsWith("rhel")
    ? RHELComponentsTable
    : DefaultComponentsTable;

  return (
    <Card className="mt-md">
      <CardTitle>Components</CardTitle>
      <CardBody>
        <Toolbar
          id="toolbar-components"
          clearAllFilters={clearAllFilters}
          collapseListedFiltersBreakpoint="xl"
          inset={{
            default: "insetNone",
          }}
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
                  tags={filters.tags}
                  onSubmit={(tags) => setFilters({ ...filters, tags })}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <div>
          {isLoading ? (
            <div>
              <Bullseye>
                <BlinkLogo />
              </Bullseye>
            </div>
          ) : components.length === 0 ? (
            isSearch ? (
              <div>
                <EmptyState
                  title="No components matching your search"
                  info={`There are no components matching your search. Please change your search.`}
                />
              </div>
            ) : (
              <div>
                <EmptyState
                  title="There is no component for this topic"
                  info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
                />
              </div>
            )
          ) : (
            <ComponentsTable
              topic_id={topic.id}
              components={components}
              onTypeClicked={(type) => setFilters({ ...filters, type: type })}
              onTagClicked={(tag) => {
                if (filters.tags.indexOf(tag) === -1) {
                  setFilters({
                    ...filters,
                    tags: [...filters.tags, tag],
                  });
                }
              }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
