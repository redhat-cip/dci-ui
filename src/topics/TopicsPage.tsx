import { useEffect, useState } from "react";
import {
  Card,
  Gallery,
  GalleryItem,
  CardBody,
  Content,
  ContentVariants,
  PageSection,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import { useLocation, useNavigate } from "react-router";
import { groupTopicsPerProduct, sortTopicWithSemver } from "./topicsActions";
import CreateTopicModal from "./CreateTopicModal";
import { getProductIcon } from "ui/icons";
import { Filters } from "types";
import {
  createSearchFromFilters,
  parseFiltersFromSearch,
} from "services/filters";
import { useCreateTopicMutation, useListTopicsQuery } from "./topicsApi";
import { useListProductsQuery } from "products/productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";

export default function TopicsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters] = useState<Filters>(
    parseFiltersFromSearch(location.search, { limit: 100 }),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/topics${newSearch}`, { replace: true });
  }, [navigate, filters]);
  const { currentUser } = useAuth();
  const { data, isLoading } = useListTopicsQuery(filters);
  const { data: dataProducts, isLoading: isLoadingProducts } =
    useListProductsQuery();

  const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();

  if (isLoading || isLoadingProducts) {
    return <LoadingPageSection />;
  }

  if (!data || !dataProducts) {
    return <EmptyState title="There is no topics" />;
  }

  const topicsPerProduct = groupTopicsPerProduct(
    data.topics,
    dataProducts.products,
  );

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Topics" }]} />
      <Content component="h1">Topics</Content>
      <Content component="p">
        Click on the topic that interests you to see its components.
      </Content>
      {currentUser?.isSuperAdmin && (
        <div className="pf-v6-u-mb-md">
          <CreateTopicModal
            products={dataProducts.products}
            onSubmit={createTopic}
            isDisabled={isCreating}
          />
        </div>
      )}
      {topicsPerProduct.length === 0 && (
        <EmptyState title="There is no topics" />
      )}
      {topicsPerProduct.map((product) => {
        const ProductIcon = getProductIcon(product.name);
        return (
          <div key={product.id} className="pf-v6-u-mb-xl">
            <Content component={ContentVariants.h2}>
              <ProductIcon className="pf-v6-u-mr-sm" />
              {product.name}
            </Content>
            <Gallery hasGutter key={product.id}>
              {product.topics.sort(sortTopicWithSemver).map((topic) => (
                <GalleryItem key={topic.id}>
                  <Card
                    onClick={() => navigate(`/topics/${topic.id}/components`)}
                    title="Click to see components"
                    className="pointer"
                  >
                    <CardBody>
                      <Content component={ContentVariants.h4}>
                        {topic.name}
                      </Content>
                      <Content component={ContentVariants.p}>
                        {topic.id}
                      </Content>
                    </CardBody>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          </div>
        );
      })}
    </PageSection>
  );
}
