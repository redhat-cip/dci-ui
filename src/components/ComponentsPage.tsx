import { useListComponentsQuery } from "./componentsApi";
import { EmptyState, Breadcrumb } from "ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createSearchFromFilters,
  parseFiltersFromSearch,
} from "services/filters";
import { Filters } from "types";
import ComponentsToolbar from "./ComponentsToolbar";
import ComponentsTable from "./ComponentsTable";
import LoadingPageSection from "ui/LoadingPageSection";
import { Content, PageSection } from "@patternfly/react-core";

export default function ComponentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, {
      sort: "-released_at",
    }),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/components${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading } = useListComponentsQuery(filters);

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no components" />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[{ to: "/", title: "DCI" }, { title: "Components" }]}
      />
      <Content component="h1">Components</Content>
      <Content component="p">
        A component is the main abstraction that describe a Red Hat component
        (RHEL, OpenStack, Openshift).
      </Content>
      <ComponentsToolbar filters={filters} setFilters={setFilters} />
      {data.components.length === 0 ? (
        <EmptyState
          title="There is no components"
          info="You need some permissions to see components on the user interface. Please contact a Distributed CI administrator."
        />
      ) : (
        <ComponentsTable
          components={data.components}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </PageSection>
  );
}
