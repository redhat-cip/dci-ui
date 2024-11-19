import { useEffect, useState } from "react";
import MainPage from "pages/MainPage";
import { getStats, JobPerRemoteciStats } from "./latestJobStatusActions";
import { isEmpty } from "lodash";
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  Title,
  Grid,
  GridItem,
  Icon,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import NbOfJobsChart from "./NbOfJobsChart";
import { getProductIcon } from "ui/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const ProductTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

export default function LatestJobStatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<JobPerRemoteciStats>({});

  useEffect(() => {
    getStats().then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, []);

  return (
    <MainPage
      title="Latest jobs status"
      description="See the latest jobs status per topic and per remoteci"
      loading={isLoading && isEmpty(products)}
      empty={!isLoading && isEmpty(products)}
      EmptyComponent={
        <EmptyState
          title="This page is empty"
          info="There is no information to display in this page at the moment. If you think this is an error contact the DCI team."
        />
      }
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Latest Jobs Status" },
          ]}
        />
      }
    >
      <Grid hasGutter>
        {Object.values(products).map((product) => {
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
    </MainPage>
  );
}
