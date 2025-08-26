import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { CopyButton, StateLabel } from "ui";
import { Link } from "react-router";
import { Label } from "@patternfly/react-core";
import { formatDate } from "services/date";
import { DateTime } from "luxon";
import type { Filters, IComponent } from "types";

export function findChannelInTags(tags: string[] | undefined | null) {
  if (!tags) {
    return "";
  }

  const channelsOrdered = ["nightly", "candidate", "milestone"];

  let maxWeight = 0;
  let channel = null;

  for (const tag of tags) {
    const tagIndex = channelsOrdered.indexOf(tag);
    if (tagIndex >= maxWeight) {
      maxWeight = tagIndex;
      channel = channelsOrdered[tagIndex];
    }
  }

  return channel;
}

export default function RHELComponentsTable({
  filters,
  setFilters,
  components,
}: {
  components: IComponent[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const setFiltersAndResetPagination = (f: Partial<Filters>) => {
    setFilters({
      ...filters,
      ...f,
      offset: 0,
    });
  };

  const onTagClicked = (tag: string) => {
    if (filters.tags && filters.tags.indexOf(tag) === -1) {
      setFiltersAndResetPagination({ tags: [...filters.tags, tag] });
    }
  };

  return (
    <Table aria-label="RHEL components table">
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
        {components.map((component) => {
          const kernel = component.tags.find((tag) =>
            tag.toLowerCase().startsWith("kernel"),
          );

          const channel = findChannelInTags(component.tags);

          return (
            <Tr key={`${component.id}.${component.etag}`}>
              <Td isActionCell>
                <CopyButton text={component.id} />
              </Td>
              <Td>
                <Link to={`/components/${component.id}`}>
                  {component.display_name}
                </Link>
              </Td>

              <Td>
                {channel !== null && (
                  <Label
                    isCompact
                    className="pf-v6-u-mt-xs pf-v6-u-mr-xs pointer"
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
                    className="pf-v6-u-mt-xs pf-v6-u-mr-xs pointer"
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
                    setFiltersAndResetPagination({ type: component.type });
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
