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
import { useNavigate } from "react-router";
import { groupTopicsPerProduct, sortTopicWithSemver } from "./topicsActions";
import CreateTopicModal from "./CreateTopicModal";
import { useCreateTopicMutation, useListTopicsQuery } from "./topicsApi";
import { useListProductsQuery } from "products/productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductIcon from "products/ProductIcon";

function TopicsList() {
  const navigate = useNavigate();
  const { data, isLoading } = useListTopicsQuery();
  const { data: dataProducts, isLoading: isLoadingProducts } =
    useListProductsQuery();

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
    <div>
      {topicsPerProduct.map((product) => (
        <div key={product.id} className="pf-v6-u-mb-xl">
          <Content component={ContentVariants.h2}>
            <ProductIcon name={product.name} className="pf-v6-u-mr-sm" />
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
                    <Content component={ContentVariants.p}>{topic.id}</Content>
                  </CardBody>
                </Card>
              </GalleryItem>
            ))}
          </Gallery>
        </div>
      ))}
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
