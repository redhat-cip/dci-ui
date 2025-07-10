import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { CopyButton, StateLabel } from "ui";
import { sortAlphabetically } from "services/sort";
import { Link } from "react-router";
import { Label } from "@patternfly/react-core";
import { formatDate } from "services/date";
import { DateTime } from "luxon";
import type { Filters, IComponent } from "types";

export default function ComponentsTable({
  filters,
  setFilters,
  components,
}: {
  components: IComponent[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  return (
    <Table aria-label="Components label">
      <Thead>
        <Tr>
          <Th className="text-center pf-m-width-10">ID</Th>
          <Th className="pf-m-width-20">Name</Th>
          <Th className="pf-m-width-40">Tags</Th>
          <Th className="pf-m-width-10">Type</Th>
          <Th className="pf-m-width-10">Released at</Th>
          <Th className="pf-m-width-10">State</Th>
        </Tr>
      </Thead>
      <Tbody>
        {components.map((component) => (
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
              <span>
                {component.tags !== null &&
                  component.tags.length !== 0 &&
                  sortAlphabetically(component.tags).map((tag, i) => (
                    <Label
                      isCompact
                      key={i}
                      className="pf-v6-u-mt-xs pf-v6-u-mr-xs pointer"
                      color="blue"
                      onClick={() => {
                        if (filters.tags && filters.tags.indexOf(tag) === -1) {
                          setFilters({
                            ...filters,
                            tags: [...filters.tags, tag],
                          });
                        }
                      }}
                    >
                      {tag}
                    </Label>
                  ))}
              </span>
            </Td>
            <Td>
              <Label
                isCompact
                className="pointer"
                onClick={() => {
                  setFilters({ ...filters, type: component.type });
                }}
              >
                {component.type}
              </Label>
            </Td>
            <Td>
              <span title={component.released_at}>
                {formatDate(component.released_at, DateTime.DATE_MED)}
              </span>
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
