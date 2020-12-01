import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isEmpty, uniqBy } from "lodash";
import { Page } from "layout";
import {
  Button,
  Card,
  CardBody,
  TextContent,
  PageSection,
  PageSectionVariants,
  Text,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { EmptyState } from "ui";
import {
  getProductsWithTeams,
  getTopicsWithTeams,
  getTeams,
  removeTeamProductPermission,
  removeTeamTopicPermission,
} from "./permissionsActions";
import { IProductWithTeams, ITeam, ITopicWithTeams } from "types";
import { AppDispatch } from "store";
import AllowTeamToAccessTopicForm from "./AllowTeamToAccessTopicForm";
import AllowTeamToAccessProductForm from "./AllowTeamToAccessProductForm";

export default function PermissionsPage() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [topics, setTopics] = useState<ITopicWithTeams[]>([]);
  const [products, setProducts] = useState<IProductWithTeams[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    Promise.all([
      dispatch(getTopicsWithTeams()),
      dispatch(getProductsWithTeams()),
      dispatch(getTeams()),
    ])
      .then((values) => {
        setTopics(values[0]);
        setProducts(values[1]);
        setTeams(values[2]);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  return (
    <Page
      title="Permissions"
      loading={isLoading}
      empty={!isLoading && teams.length === 0}
      HeaderSection={
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Permissions</Text>
            <Text component="p">
              On this page, you can grant teams permissions to access products.
              <br />
              Make sure the team has the rights before giving it permission to
              download components from a product.
            </Text>
          </TextContent>
        </PageSection>
      }
      EmptyComponent={
        <EmptyState
          title="There is no teams. You cannot manage permissions"
          info="Contact DCI administrator"
        />
      }
    >
      <Card>
        <CardBody>
          <Tabs
            activeKey={activeTabKey}
            onSelect={(event, tabIndex) => {
              if (tabIndex !== undefined) {
                setActiveTabKey(parseInt(tabIndex as string, 10));
              }
            }}
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>Products Teams Permissions</TabTitleText>}
            >
              <TextContent className="mt-lg">
                <Text component="p">
                  By giving access to a product, a team can download all GA
                  topics.
                  <br />
                  If you want to give access to a non-GA topic, you can use the
                  Topics Teams Permissions tab.
                </Text>
              </TextContent>
              <AllowTeamToAccessProductForm
                teams={teams}
                products={products}
                onClick={(team, product) => {
                  const newProducts = products.map((p) => {
                    if (p.id === product.id) {
                      p.teams = uniqBy([...p.teams, team], "id");
                    }
                    return p;
                  });
                  setProducts(newProducts);
                }}
              />
              {products.map((product) => {
                if (isEmpty(product.teams)) return null;
                return (
                  <TextContent
                    key={`${product.id}.${product.etag}`}
                    className="mt-lg"
                  >
                    <Text component="h1">{product.name}</Text>
                    <Text component="p">
                      List of teams that have access to {product.name}
                    </Text>
                    <table
                      className="pf-c-table pf-m-grid-md pf-m-compact"
                      role="grid"
                    >
                      <tbody>
                        {product.teams.map((team) => (
                          <tr key={`${team.id}.${team.etag}`}>
                            <td className="pf-m-width-30">{team.name}</td>
                            <td className="pf-m-width-70">
                              <Button
                                variant="danger"
                                icon={<TrashIcon />}
                                onClick={() =>
                                  dispatch(
                                    removeTeamProductPermission(team, product)
                                  ).then(() => {
                                    const newProducts = products.map((p) => {
                                      if (p.id === product.id) {
                                        p.teams = p.teams.filter(
                                          (t) => t.id !== team.id
                                        );
                                      }
                                      return p;
                                    });
                                    setProducts(newProducts);
                                  })
                                }
                              >
                                remove {team.name} permission
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TextContent>
                );
              })}
            </Tab>
            <Tab
              eventKey={1}
              title={<TabTitleText>Topics Teams Permissions</TabTitleText>}
            >
              <TextContent className="mt-lg">
                <Text component="p">
                  By giving access to a topic not export control ready, a team
                  can download all components from this topic.
                  <br />
                  Make sure the team has the rights before giving it permission
                  to download a product.
                </Text>
              </TextContent>
              <AllowTeamToAccessTopicForm
                teams={teams}
                topics={topics}
                onClick={(team, topic) => {
                  const newTopics = topics.map((t) => {
                    if (t.id === topic.id) {
                      t.teams = uniqBy([...t.teams, team], "id");
                    }
                    return t;
                  });
                  setTopics(newTopics);
                }}
              />
              {topics.map((topic) => (
                <TextContent
                  key={`${topic.id}.${topic.etag}`}
                  className="mt-lg"
                >
                  <Text component="h1">{topic.name}</Text>
                  <Text component="p">
                    List of teams that have access to {topic.name}
                  </Text>
                  <table
                    className="pf-c-table pf-m-grid-md pf-m-compact"
                    role="grid"
                  >
                    <tbody>
                      {topic.teams.map((team) => (
                        <tr key={`${team.id}.${team.etag}`}>
                          <td className="pf-m-width-30">{team.name}</td>
                          <td className="pf-m-width-70">
                            <Button
                              variant="danger"
                              icon={<TrashIcon />}
                              onClick={() => {
                                dispatch(
                                  removeTeamTopicPermission(team, topic)
                                ).then(() => {
                                  const newTopics = topics.map((t) => {
                                    if (t.id === topic.id) {
                                      t.teams = t.teams.filter(
                                        (t) => t.id !== team.id
                                      );
                                    }
                                    return t;
                                  });
                                  setTopics(newTopics);
                                });
                              }}
                            >
                              remove {team.name} permission
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TextContent>
              ))}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </Page>
  );
}
