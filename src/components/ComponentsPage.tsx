import { useListComponentsQuery } from "./componentsApi";
import { EmptyState, Breadcrumb } from "ui";
import { useLocation, useNavigate } from "react-router";
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

function Components() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, {
      sort: "-released_at",
    }),
  );
  const isFiltered =
    filters.display_name !== "" ||
    filters.type !== "" ||
    filters.tags?.length !== 0;

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

  const nbComponents = data._meta.count;

  return (
    <div>
      <ComponentsToolbar
        filters={filters}
        setFilters={setFilters}
        nbOfComponents={nbComponents}
      />
      {nbComponents === 0 ? (
        isFiltered ? (
          <EmptyState
            title="There is no components"
            info="There is no components matching your search. Please update your search"
          />
        ) : (
          <EmptyState title="There is no components" />
        )
      ) : (
        <ComponentsTable
          components={data.components}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  );
}

export default function ComponentsPage() {
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
      <Components />
    </PageSection>
  );
}
