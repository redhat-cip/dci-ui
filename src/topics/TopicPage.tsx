import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import topicsActions, {
  fetchLatestComponents,
  fetchComponents,
} from "./topicsActions";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import {
  Card,
  CardBody,
  Title,
  Divider,
  Button,
  Label,
  CodeBlock,
  CodeBlockCode,
  CodeBlockAction,
  InputGroup,
  TextInput,
  ButtonVariant,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarFilter,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import Component from "./Component";
import { AppDispatch } from "store";
import { IComponent, IEnhancedTopic, ITopic } from "types";
import { useParams } from "react-router-dom";
import EditTopicModal from "./EditTopicModal";
import productsActions from "products/productsActions";
import { getProducts } from "products/productsSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import CardLine from "ui/CardLine";
import { Link } from "react-router-dom";
import { getTopicById } from "./topicsSelectors";
import { SearchIcon } from "@patternfly/react-icons";
import { buildWhereFromSearch } from "search/where";
import { sortByNewestFirst } from "services/sort";

interface ComponentsProps {
  topic: ITopic;
}

function LatestComponentsPerType({ topic }: ComponentsProps) {
  const [isFetching, setIsFetching] = useState(true);
  const [components, setComponents] = useState<IComponent[]>([]);

  useEffect(() => {
    fetchLatestComponents(topic)
      .then((response) => setComponents(response.data.components))
      .catch(console.error)
      .then(() => setIsFetching(false));
  }, [topic, setIsFetching]);

  return (
    <Card className="mt-md">
      <CardBody>
        <Title headingLevel="h3" size="xl">
          Latest components per type
        </Title>
        <div className="py-md">
          {isFetching ? (
            <div>loading</div>
          ) : components.length === 0 ? (
            <div>
              <EmptyState
                title="There is no component for this topic"
                info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
              />
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              {components.map((component) => (
                <Component key={component.id} component={component} />
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function ComponentsTable({ topic }: ComponentsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState<IComponent[]>([]);
  const [componentName, setComponentName] = useState("");
  const [search, setSearch] = useState("");

  const fetchComponentsCallback = useCallback(() => {
    setIsLoading(true);
    setComponents([]);
    fetchComponents(
      topic,
      buildWhereFromSearch(componentName, "canonical_project_name")
    )
      .then((response) => setComponents(response.data.components))
      .finally(() => setIsLoading(false));
  }, [componentName, topic]);

  useEffect(() => {
    fetchComponentsCallback();
  }, [fetchComponentsCallback]);

  function clearSearch() {
    setSearch("");
    setComponentName("");
  }

  function clearAllFilters() {
    clearSearch();
  }

  return (
    <Card className="mt-md">
      <CardBody>
        <Title headingLevel="h3" size="xl">
          Components
        </Title>

        <Toolbar
          id="toolbar-component"
          clearAllFilters={clearAllFilters}
          collapseListedFiltersBreakpoint="xl"
          inset={{
            default: "insetNone",
          }}
        >
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <ToolbarFilter
                  chips={componentName === "" ? [] : [componentName]}
                  deleteChip={clearSearch}
                  categoryName="Search"
                  showToolbarItem
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setComponentName(search);
                      setSearch("");
                    }}
                  >
                    <InputGroup>
                      <TextInput
                        name="component"
                        id="input-component"
                        type="text"
                        aria-label="component input search"
                        onChange={(component) => setSearch(component)}
                        value={search}
                        placeholder="Search a component..."
                      />
                      <Button
                        variant={ButtonVariant.control}
                        aria-label="search component button"
                        type="submit"
                      >
                        <SearchIcon />
                      </Button>
                    </InputGroup>
                  </form>
                </ToolbarFilter>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <div>
          {isLoading ? (
            <div>loading</div>
          ) : components.length === 0 ? (
            componentName === "" ? (
              <div>
                <EmptyState
                  title="There is no component for this topic"
                  info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
                />
              </div>
            ) : (
              <div>
                <EmptyState
                  title="No components matching your search"
                  info={`There are no components matching ${search}. Please change your search.`}
                />
              </div>
            )
          ) : (
            <table className="pf-c-table pf-m-compact pf-m-grid-md">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Tags</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {sortByNewestFirst(components, "released_at").map(
                  (component) => (
                    <tr key={`${component.id}.${component.etag}`}>
                      <td className="text-center">
                        <CopyButton text={component.id} />
                      </td>
                      <td>
                        <Link
                          to={`/topics/${topic.id}/components/${component.id}`}
                        >
                          {component.canonical_project_name}
                        </Link>
                      </td>
                      <td>
                        <Label
                          isCompact
                          className="pointer"
                          onClick={() => {
                            setComponentName(`type:${component.type}`);
                          }}
                        >
                          {component.type}
                        </Label>
                      </td>
                      <td>
                        <span>
                          {component.tags !== null &&
                          component.tags.length !== 0
                            ? component.tags.map((tag, i) => (
                                <Label
                                  isCompact
                                  key={i}
                                  className="mt-xs mr-xs pointer"
                                  color="blue"
                                  onClick={() => {
                                    setComponentName(`tags:${tag}`);
                                  }}
                                >
                                  {tag}
                                </Label>
                              ))
                            : "no tags"}
                        </span>
                      </td>
                      <td>{component.state}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function TopicDetails({ topic }: { topic: IEnhancedTopic }) {
  console.log(topic);
  const [seeData, setSeeData] = useState(false);
  const topicData = isEmpty(topic.data)
    ? "{}"
    : JSON.stringify(topic?.data, null, 2);

  return (
    <Card>
      <CardBody>
        <Title headingLevel="h3" size="xl">
          Topic details
        </Title>

        <CardLine className="p-md" field="ID" value={topic.id} />
        <Divider />
        <CardLine className="p-md" field="Name" value={topic.name} />
        <Divider />
        <CardLine
          className="p-md"
          field="Access restricted"
          help="This topic has not yet been validated by the legal team. All of these components are restricted."
          value={
            topic.export_control ? (
              <Label color="green">no</Label>
            ) : (
              <Label color="red">yes</Label>
            )
          }
        />
        <Divider />
        <CardLine className="p-md" field="State" value={topic.state} />
        <Divider />
        <CardLine
          className="p-md"
          field="Created"
          value={
            <time dateTime={topic.created_at} title={topic.created_at}>
              {topic.from_now}
            </time>
          }
        />
        <Divider />
        <CardLine
          className="p-md"
          field="Data"
          value={
            seeData ? (
              <Button
                onClick={() => setSeeData(false)}
                type="button"
                variant="tertiary"
                isSmall
              >
                hide content
              </Button>
            ) : (
              <Button
                onClick={() => setSeeData(true)}
                type="button"
                variant="tertiary"
                isSmall
              >
                see content
              </Button>
            )
          }
        />
        {seeData && (
          <CodeBlock
            actions={[
              <CodeBlockAction>
                <CopyButton text={topicData} variant="plain" />
              </CodeBlockAction>,
            ]}
          >
            <CodeBlockCode id="topic.data">{topicData}</CodeBlockCode>
          </CodeBlock>
        )}
        <Divider />
        {topic.product && (
          <CardLine
            className="p-md"
            field="Product"
            value={topic.product.name}
          />
        )}
        <Divider />
        <CardLine
          className="p-md"
          field="Component types"
          value={topic.component_types.join(" - ")}
        />
      </CardBody>
    </Card>
  );
}

export default function TopicPage() {
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch<AppDispatch>();
  const { topic_id } = useParams();
  const topic = useSelector(getTopicById(topic_id));
  const [isFetching, setIsFetching] = useState(true);
  const products = useSelector(getProducts);

  const getTopicCallback = useCallback(() => {
    if (topic_id) {
      dispatch(topicsActions.one(topic_id)).finally(() => setIsFetching(false));
    }
  }, [dispatch, topic_id, setIsFetching]);

  useEffect(() => {
    getTopicCallback();
    dispatch(productsActions.all());
  }, [dispatch, getTopicCallback]);

  if (!topic_id) return null;

  return (
    <MainPage
      title={topic ? `Topic ${topic.name}` : "Topic"}
      description={
        topic ? `Details page for topic ${topic.name}` : "Details page"
      }
      loading={isFetching && topic === null}
      empty={!isFetching && topic === null}
      HeaderButton={
        currentUser?.isSuperAdmin && topic ? (
          <EditTopicModal
            key={`${topic.id}:${topic.etag}`}
            products={products}
            topic={topic}
            onSubmit={(editedProduct) => {
              dispatch(topicsActions.update(editedProduct)).then(
                getTopicCallback
              );
            }}
          />
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no topic"
          info={`There is not topic with id ${topic_id}`}
        />
      }
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/topics", title: "Topics" },
            { to: `/topics/${topic_id}/components`, title: topic_id },
          ]}
        />
      }
    >
      {topic === null ? null : (
        <>
          <TopicDetails topic={topic} />
          <LatestComponentsPerType topic={topic} />
          <ComponentsTable topic={topic} />
        </>
      )}
    </MainPage>
  );
}
