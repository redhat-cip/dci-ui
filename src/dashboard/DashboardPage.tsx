import { useEffect, useState } from "react";
import { Page } from "layout";
import { getStats, Dashboard } from "./dashboardActions";
import { isEmpty } from "lodash";
import { ProductTitle } from "../topics/TopicsPage";
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  Title,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import { EmptyState, Breadcrumb } from "ui";
import NbOfJobsChart from "./NbOfJobsChart";
import { getProductIcon } from "ui/icons";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Dashboard>({});
  const history = useHistory();

  useEffect(() => {
    getStats().then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, []);

  return (
    <Page
      title="Dashboard"
      description="See the latest jobs status per topic and per remoteci"
      loading={isLoading && isEmpty(products)}
      empty={!isLoading && isEmpty(products)}
      EmptyComponent={
        <EmptyState
          title="Your Dashboard is empty"
          info="There is no information to display in the dashboard at the moment. If you think this is an error contact the DCI team."
        />
      }
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Dashboard" }]}
        />
      }
    >
      <Grid hasGutter>
        {Object.values(products).map((product) => {
          const Icon = getProductIcon(product.name);
          return (
            <GridItem key={product.id} span={12} className="mb-xl">
              <ProductTitle>
                <span className="mr-xs">
                  <Icon size="md" />
                </span>
                {product.name}
              </ProductTitle>
              <Gallery hasGutter key={product.id}>
                {product.stats.map((stat, index) => (
                  <GalleryItem key={index}>
                    <Card
                      onClick={() =>
                        history.push(`/dashboard/${stat.topic.name}`)
                      }
                      title="Click to see detailed stats for this topic"
                      className="pointer"
                    >
                      <CardBody>
                        <Title headingLevel="h6" size="md">
                          {stat.topic.name}
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
    </Page>
  );
};

export default DashboardPage;
