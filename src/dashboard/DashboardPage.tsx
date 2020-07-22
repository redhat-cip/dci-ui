import React, { useEffect, useState } from "react";
import { Page } from "layout";
import { useDispatch } from "react-redux";
import { getStats, Dashboard } from "./dashboardActions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "types";
import { Action } from "redux";
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
import { icons } from "ui";
import NbOfJobsChart from "./NbOfJobsChart";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Dashboard>({});
  const dispatch = useDispatch<ThunkDispatch<State, unknown, Action>>();
  const history = useHistory();

  useEffect(() => {
    dispatch(getStats()).then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Page
      title="Dashboard"
      description="See the latest jobs status per topic and per remoteci"
      loading={isLoading && isEmpty(products)}
    >
      <Grid hasGutter>
        {Object.values(products).map((product) => {
          const Icon = icons.getProductIcon(product.name);
          return (
            <GridItem span={12} className="mb-xl">
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
                        history.push({
                          pathname: `/dashboard/${stat.topic.name}`,
                          state: {
                            ...stat,
                          },
                        })
                      }
                      title="Click to see detailed stats for this topic"
                      style={{ cursor: "pointer" }}
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
