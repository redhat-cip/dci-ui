import { useListComponentsQuery } from "./componentsApi";
import MainPage from "pages/MainPage";
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
  if (!data) return null;

  return (
    <MainPage
      title="Components"
      description="A component is the main abstraction that describe a Red Hat component (RHEL, OpenStack, Openshift)."
      loading={isLoading}
      empty={data.components.length === 0}
      EmptyComponent={
        <EmptyState
          title="There is no components"
          info="You need some permissions to see components on the user interface. Please contact an administrator"
        />
      }
      Toolbar={<ComponentsToolbar filters={filters} setFilters={setFilters} />}
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Components" }]}
        />
      }
    >
      <ComponentsTable
        components={data.components}
        filters={filters}
        setFilters={setFilters}
      />
    </MainPage>
  );
}
