import { useEffect, useState } from "react";
import { getStats, JobPerRemoteciStat } from "./latestJobStatusActions";
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
import { getProductIcon } from "ui/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LoadingPageSection from "ui/LoadingPageSection";

const ProductTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

export default function LatestJobStatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<JobPerRemoteciStat[]>([]);

  useEffect(() => {
    getStats().then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingPageSection />;
  }

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
      {products.length === 0 ? (
        <EmptyState
          title="This page is empty"
          info="There is no information to display in this page at the moment. If you think this is an error contact the DCI team."
        />
      ) : (
        <Grid hasGutter>
          {products.map((product) => {
            const ProductIcon = getProductIcon(product.name);
            return (
              <GridItem key={product.id} span={12} className="pf-v6-u-mb-xl">
                <ProductTitle>
                  <span className="pf-v6-u-mr-xs">
                    <Icon size="md">
                      <ProductIcon />
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
      )}
    </PageSection>
  );
}
