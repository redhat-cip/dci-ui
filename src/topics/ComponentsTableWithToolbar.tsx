import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import type { ITopic } from "types";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  parseFiltersFromSearch,
} from "services/filters";
import type { Filters } from "types";
import { useListComponentsQuery } from "components/componentsApi";
import RHELComponentsTable from "components/RHELComponentsTable";
import DefaultComponentsTable from "components/ComponentsTable";
import ComponentsToolbar from "components/ComponentsToolbar";

export default function ComponentsTableWithToolbar({
  topic,
}: {
  topic: ITopic;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, {
      sort: "-released_at",
      topic_id: topic.id,
    }),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/topics/${topic.id}/components${newSearch}`, { replace: true });
  }, [navigate, filters, topic.id]);

  const { data } = useListComponentsQuery(filters);
  if (!data) return null;

  const ComponentsTable = topic.name.toLowerCase().startsWith("rhel")
    ? RHELComponentsTable
    : DefaultComponentsTable;

  return (
    <Card className="pf-v6-u-mt-md">
      <CardTitle>Components</CardTitle>
      <CardBody>
        <ComponentsToolbar
          filters={filters}
          setFilters={setFilters}
          nbOfComponents={data._meta.count}
        />
        <ComponentsTable
          components={data.components}
          filters={filters}
          setFilters={setFilters}
        />
      </CardBody>
    </Card>
  );
}
