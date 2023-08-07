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
  CardTitle,
  Bullseye,
} from "@patternfly/react-core";
import {
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core/deprecated";
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
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

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
    <Table aria-label="RHEL components table" variant="compact">
      <Thead>
        <Tr>
          <Th className="text-center pf-m-width-10">ID</Th>
          <Th className="pf-m-width-40">Name</Th>
          <Th className="pf-m-width-10">Channel</Th>
          <Th className="pf-m-width-10">Kernel</Th>
          <Th className="pf-m-width-10">Released at</Th>
          <Th className="pf-m-width-10">Type</Th>
          <Th className="pf-m-width-10">State</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortByNewestFirst(components, "released_at").map((component) => {
          const kernel = component.tags.find((tag) =>
            tag.toLowerCase().startsWith("kernel"),
          );

          const channel = findChannelInTags(component.tags);

          return (
            <Tr key={`${component.id}.${component.etag}`}>
              <Td className="text-center">
                <CopyButton text={component.id} />
              </Td>
              <Td>
                <Link to={`/topics/${topic_id}/components/${component.id}`}>
                  {component.display_name}
                </Link>
              </Td>

              <Td>
                {channel !== null && (
                  <Label
                    isCompact
                    className="pf-v5-u-mt-xs pf-v5-u-mr-xs pointer"
                    color="blue"
                    onClick={() => {
                      onTagClicked(channel);
                    }}
                  >
                    {channel}
                  </Label>
                )}
              </Td>
              <Td>
                {kernel !== undefined && (
                  <Label
                    isCompact
                    className="pf-v5-u-mt-xs pf-v5-u-mr-xs pointer"
                    color="blue"
                    onClick={() => {
                      onTagClicked(kernel);
                    }}
                  >
                    {kernel.replace("kernel:", "")}
                  </Label>
                )}
              </Td>
              <Td>{formatDate(component.released_at, DateTime.DATE_MED)}</Td>
              <Td>
                <Label
                  isCompact
                  className="pointer"
                  onClick={() => {
                    onTypeClicked(component.type);
                  }}
                >
                  {component.type}
                </Label>
              </Td>
              <Td>
                <StateLabel isCompact state={component.state} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

function DefaultComponentsTable({
  topic_id,
  components,
  onTagClicked,
  onTypeClicked,
}: ComponentTableProps) {
  return (
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
        {sortByNewestFirst(components, "released_at").map((component) => (
          <Tr key={`${component.id}.${component.etag}`}>
            <Td className="text-center">
              <CopyButton text={component.id} />
            </Td>
            <Td>
              <Link to={`/topics/${topic_id}/components/${component.id}`}>
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
                      className="pf-v5-u-mt-xs pf-v5-u-mr-xs pointer"
                      color="blue"
                      onClick={() => {
                        onTagClicked(tag);
                      }}
                    >
                      {tag}
                    </Label>
                  ))}
              </span>
            </Td>
            <Td>{formatDate(component.released_at, DateTime.DATE_MED)}</Td>
            <Td>
              <Label
                isCompact
                className="pointer"
                onClick={() => {
                  onTypeClicked(component.type);
                }}
              >
                {component.type}
              </Label>
            </Td>
            <Td>
              <StateLabel isCompact state={component.state} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
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
    parseWhereFromSearch(location.search),
  );

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Categories[0],
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
    <Card className="pf-v5-u-mt-md">
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
