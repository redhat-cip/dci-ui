import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, get } from "lodash";
import { Page } from "layout";
import {
  Card,
  Gallery,
  GalleryItem,
  PageSection,
  CardBody,
  Title,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import { getActiveTopics, isFetchingTopics } from "./topicsSelectors";
import styled from "styled-components";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { IEnhancedTopic, IProduct } from "types";
import { useHistory } from "react-router-dom";
import topicsActions from "./topicsActions";
import { AppDispatch } from "store";
import productsActions from "products/productsActions";
import CreateTopicModal from "./CreateTopicModal";
import { getProducts } from "products/productsSelectors";
import { getProductIcon } from "ui/icons";

export const ProductTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const TopicId = styled.p`
  font-size: 0.7em;
  overflow-wrap: break-word;
`;

const Topic = styled(Card)`
  display: flex;
`;

interface IProductWithTopics extends IProduct {
  topics: IEnhancedTopic[];
}

export default function TopicsPage() {
  const currentUser = useSelector(getCurrentUser);
  const topics = useSelector(getActiveTopics);
  const products = useSelector(getProducts);
  const isFetching = useSelector(isFetchingTopics);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const topicsPerProduct = topics.reduce((acc, topic) => {
    const product = topic.product;
    if (!product) {
      return acc;
    }
    const productName = product.name.toLowerCase();
    const currentProduct = get(acc, productName, {
      ...product,
      topics: [],
    } as IProductWithTopics);
    currentProduct.topics.push(topic);
    acc[productName] = currentProduct;
    return acc;
  }, {} as { [productName: string]: IProductWithTopics });

  useEffect(() => {
    dispatch(topicsActions.all({ embed: "product" }));
    dispatch(productsActions.all());
  }, [dispatch]);

  if (currentUser === null) return null;

  return (
    <Page
      title="Topics"
      description="Click on the topic that interests you to see its components."
      loading={isFetching && isEmpty(topicsPerProduct)}
      empty={!isFetching && isEmpty(topicsPerProduct)}
      HeaderButton={
        currentUser.isSuperAdmin ? (
          <CreateTopicModal
            products={products}
            onSubmit={(newTopic) => {
              dispatch(topicsActions.create(newTopic));
            }}
          />
        ) : null
      }
      EmptyComponent={
        <EmptyState title="There is no topics" info="See documentation" />
      }
      breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Topics" }]} />
      }
    >
      {Object.values(topicsPerProduct)
        .sort((p1, p2) => {
          const lowercaseProductsOrder = ["openshift", "rhel", "openstack"];
          return (
            lowercaseProductsOrder.indexOf(p1.name.toLowerCase()) -
            lowercaseProductsOrder.indexOf(p2.name.toLowerCase())
          );
        })
        .map((product) => {
          const Icon = getProductIcon(product.name);
          return (
            <PageSection key={product.id}>
              <ProductTitle>
                <span className="mr-xs">
                  <Icon size="md" />
                </span>
                {product.name}
              </ProductTitle>
              <Gallery hasGutter key={product.id}>
                {product.topics.map((topic) => (
                  <GalleryItem key={topic.id}>
                    <Topic
                      onClick={() =>
                        history.push(`/topics/${topic.id}/components`)
                      }
                      title="Click to see components"
                      className="pointer"
                    >
                      <CardBody>
                        <Title headingLevel="h6" size="md">
                          {topic.name}
                        </Title>
                        <TopicId>{topic.id}</TopicId>
                      </CardBody>
                    </Topic>
                  </GalleryItem>
                ))}
              </Gallery>
            </PageSection>
          );
        })}
    </Page>
  );
}
