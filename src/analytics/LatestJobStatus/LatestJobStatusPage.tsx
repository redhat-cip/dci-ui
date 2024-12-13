import { useEffect } from "react";
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  Title,
  Grid,
  GridItem,
  Icon,
  PageSection,
  Content,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import NbOfJobsChart from "./NbOfJobsChart";
import styled from "styled-components";
import { Link } from "react-router";
import LoadingPageSection from "ui/LoadingPageSection";
import { useLazyGetStatsQuery } from "./latestJobStatusApi";
import ProductIcon from "products/ProductIcon";

const ProductTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

function LatestJobStatus() {
  const [getStats, { data: products, isLoading }] = useLazyGetStatsQuery();

  useEffect(() => {
    getStats();
  }, [getStats]);

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!products) {
    return (
      <EmptyState
        title="This page is empty"
        info="There is no information to display in this page at the moment. If you think this is an error contact the DCI team."
      />
    );
  }
  return (
    <Grid hasGutter>
      {products.map((product) => {
        return (
          <GridItem key={product.id} span={12} className="pf-v6-u-mb-xl">
            <ProductTitle>
              <span className="pf-v6-u-mr-xs">
                <Icon size="md">
                  <ProductIcon name={product.name} />
                </Icon>
              </span>
              {product.name}
            </ProductTitle>
            <Gallery hasGutter key={product.id}>
              {product.stats.map((stat, index) => (
                <GalleryItem key={index}>
                  <Card
                    title="Click to see detailed stats for this topic"
                    className="pointer"
                  >
                    <CardBody>
                      <Title headingLevel="h6" size="md">
                        <Link
                          to={`/analytics/latest_jobs_status/${stat.topic.name}`}
                        >
                          {stat.topic.name}
                        </Link>
                      </Title>
                      <NbOfJobsChart stat={stat} />
                    </CardBody>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          </GridItem>
        );
      })}
    </Grid>
  );
}

export default function LatestJobStatusPage() {
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Latest Jobs Status" },
        ]}
      />
      <Content component="h1">Latest jobs status</Content>
      <Content component="p">
        See the latest jobs status per topic and per remoteci
      </Content>
      <LatestJobStatus />
    </PageSection>
  );
}
