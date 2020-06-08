import React, { Component } from "react";
import { connect } from "react-redux";
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
import {
  global_danger_color_100,
  global_success_color_100,
  global_Color_light_100,
} from "@patternfly/react-tokens";
import productsActions from "products/productsActions";
import topicsActions from "../topics/topicsActions";
import { EmptyState } from "ui";
import { getTopics } from "../topics/topicsSelectors";
import NewTopicButton from "./NewTopicButton";
import {
  RedhatIcon,
  OpenshiftIcon,
  OpenstackIcon,
  BoxIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";

const ProductTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const TopicId = styled.p`
  font-size: 0.8em;
  overflow-wrap: break-word;
`;

function getBackground(export_control) {
  if (export_control) {
    return `linear-gradient(to right,${global_success_color_100.value} 0,${global_success_color_100.value} 5px,${global_Color_light_100.value} 5px,${global_Color_light_100.value} 100%) no-repeat`;
  }
  return `linear-gradient(to right,${global_danger_color_100.value} 0,${global_danger_color_100.value} 5px,${global_Color_light_100.value} 5px,${global_Color_light_100.value} 100%) no-repeat`;
}

const Topic = styled(Card)`
  background: ${(props) => getBackground(props.export_control)};
  height: 110px;
  display: flex;
`;

export class TopicsPage extends Component {
  state = {
    topic: null,
    components: [],
  };
  componentDidMount() {
    const { fetchTopics } = this.props;
    fetchTopics();
  }
  render() {
    const { currentUser, topics, isFetching, history } = this.props;
    const icons = {
      openshift: OpenshiftIcon,
      openstack: OpenstackIcon,
      rhel: RedhatIcon,
    };
    const products = topics.reduce((acc, topic) => {
      const product = topic.product;
      if (!product) {
        return acc;
      }
      const productName = product.name.toLowerCase();
      const Icon = get(icons, productName, BoxIcon);
      const currentProduct = get(acc, productName, {
        ...product,
        topics: [],
        icon: <Icon size="md" />,
      });
      currentProduct.topics.push(topic);
      acc[productName] = currentProduct;
      return acc;
    }, {});
    return (
      <Page
        title="Topics"
        description="Click on the topic that interests you to see its components."
        loading={isFetching && isEmpty(products)}
        empty={!isFetching && isEmpty(products)}
        HeaderButton={currentUser.isSuperAdmin ? <NewTopicButton /> : null}
        EmptyComponent={
          <EmptyState title="There is no topics" info="See documentation" />
        }
      >
        {Object.values(products).map((product) => (
          <PageSection>
            <ProductTitle>
              <span className="mr-xs">{product.icon}</span>
              {product.name}
            </ProductTitle>
            <Gallery gutter="md" key={product.id}>
              {product.topics.map((topic) => (
                <GalleryItem key={topic.id}>
                  <Topic
                    onClick={() =>
                      history.push(`/topics/${topic.id}/components`)
                    }
                    title="Click to see components"
                    style={{ cursor: "pointer" }}
                    export_control={topic.export_control}
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
        ))}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    topics: getTopics(state),
    isFetching: state.topics.isFetching || state.products.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(topicsActions.all({ embed: "product" }));
      dispatch(productsActions.all());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicsPage);
