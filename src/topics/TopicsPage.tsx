import {
  Card,
  Gallery,
  GalleryItem,
  Content,
  ContentVariants,
  PageSection,
  Button,
  CardTitle,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CardSecondaryTitle, Truncate } from "ui";
import { Link, useLocation, useNavigate } from "react-router";
import { groupTopicsPerProduct } from "./topicsActions";
import { sortWithSemver } from "services/sort";
import CreateTopicModal from "./CreateTopicModal";
import { useCreateTopicMutation, useListTopicsQuery } from "./topicsApi";
import { useListProductsQuery } from "products/productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductIcon from "products/ProductIcon";
import { sortByName } from "services/sort";
import { useEffect, useState } from "react";
import { Filters } from "types";
import {
  createSearchFromFilters,
  parseFiltersFromSearch,
} from "services/filters";

function TopicsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search, {
      limit: 100,
      sort: "-created_at",
      state: "active",
    }),
  );
  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/topics${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isFetching } = useListTopicsQuery(filters);
  const { data: dataProducts, isLoading: isLoadingProducts } =
    useListProductsQuery();

  if (isFetching || isLoadingProducts) {
    return <LoadingPageSection />;
  }

  if (!data || data.topics.length === 0) {
    return <EmptyState title="There is no topics" />;
  }

  if (!dataProducts || dataProducts.products.length === 0) {
    return <EmptyState title="There is no products" />;
  }

  const topicsPerProduct = sortByName(
    groupTopicsPerProduct(data.topics, dataProducts.products),
  );

  return (
    <div>
      <div>
        {topicsPerProduct.map((product) => (
          <div key={product.id} className="pf-v6-u-mb-xl">
            <Content component={ContentVariants.h2}>
              <ProductIcon name={product.name} className="pf-v6-u-mr-sm" />
              {product.name}
            </Content>
            <Gallery hasGutter key={product.id}>
              {product.topics.sort(sortWithSemver).map((topic) => (
                <GalleryItem key={topic.id}>
                  <Card isCompact isDisabled={topic.state !== "active"}>
                    <CardTitle>
                      <Link to={`/topics/${topic.id}/components`}>
                        {topic.name}
                      </Link>
                    </CardTitle>
                    <CardSecondaryTitle className="pf-v6-u-font-family-monospace">
                      <Truncate>{topic.id}</Truncate>
                    </CardSecondaryTitle>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          </div>
        ))}
      </div>
      {filters.product_id !== null && (
        <div>
          <Button
            variant="link"
            onClick={() => setFilters((f) => ({ ...f, product_id: null }))}
          >
            See other topics
          </Button>
        </div>
      )}
    </div>
  );
}

export default function TopicsPage() {
  const { currentUser } = useAuth();
  const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Topics" }]} />
      <Content component="h1">Topics</Content>
      <Content component="p">
        Click on the topic that interests you to see its components.
      </Content>
      {currentUser?.isSuperAdmin && (
        <div className="pf-v6-u-mb-xl">
          <CreateTopicModal onSubmit={createTopic} isDisabled={isCreating} />
        </div>
      )}
      <TopicsList />
    </PageSection>
  );
}
