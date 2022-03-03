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
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import styled from "styled-components";
import Component from "./Component";
import { AppDispatch } from "store";
import { IComponent, ITopic } from "types";
import { useParams } from "react-router-dom";
import EditTopicModal from "./EditTopicModal";
import productsActions from "products/productsActions";
import { getProducts } from "products/productsSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import CardLine from "ui/CardLine";
import { Link } from "react-router-dom";
import { getTopicById } from "./topicsSelectors";

const ComponentsContainer = styled.div`
  padding-top: 1em;
`;

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

  if (isFetching) {
    return <div>loading</div>;
  }

  if (isEmpty(components)) {
    return (
      <div className="mt-xl">
        <EmptyState
          title="There is no component for this topic"
          info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
        />
      </div>
    );
  }

  return (
    <ComponentsContainer>
      {components.map((component) => (
        <Component key={component.id} component={component} />
      ))}
    </ComponentsContainer>
  );
}

function ComponentsTable({ topic }: ComponentsProps) {
  const [isFetching, setIsFetching] = useState(true);
  const [components, setComponents] = useState<IComponent[]>([]);

  useEffect(() => {
    fetchComponents(topic)
      .then((response) => setComponents(response.data.components))
      .catch(console.error)
      .then(() => setIsFetching(false));
  }, [topic, setIsFetching]);

  if (isFetching) {
    return <div className="p-xl">loading</div>;
  }

  if (isEmpty(components)) {
    return (
      <div className="mt-xl">
        <EmptyState
          title="There is no component for this topic"
          info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
        />
      </div>
    );
  }

  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Tags</th>
          <th className="text-center">Link</th>
        </tr>
      </thead>
      <tbody>
        {components.map((component) => (
          <tr key={`${component.id}.${component.etag}`}>
            <td className="text-center">
              <CopyButton text={component.id} />
            </td>
            <td>{component.name}</td>
            <td>{component.type}</td>
            <td>
              <span>
                {component.tags !== null && component.tags.length !== 0
                  ? component.tags.map((tag, i) => (
                      <Label key={i} className="mt-xs mr-xs" color="blue">
                        {tag}
                      </Label>
                    ))
                  : "no tags"}
              </span>
            </td>
            <td className="text-center">
              <Link to={`/topics/${topic.id}/components/${component.id}`}>
                see details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TopicPage() {
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch<AppDispatch>();
  const { topic_id } = useParams();
  const topic = useSelector(getTopicById(topic_id));
  const [isFetching, setIsFetching] = useState(true);
  const products = useSelector(getProducts);
  const [seeData, setSeeData] = useState(false);

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

  const topicData = isEmpty(topic?.data)
    ? "{}"
    : JSON.stringify(topic?.data, null, 2);

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
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="xl" className="p-md">
                Topic information
              </Title>
              <Divider />
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
              <Divider />
              <CardLine
                className="p-md"
                field="Latest components per type"
                value={<LatestComponentsPerType topic={topic} />}
              />
            </CardBody>
          </Card>
          <Card className="mb-md">
            <CardBody>
              <Title headingLevel="h3" size="xl" className="p-md">
                Components
              </Title>
              <ComponentsTable topic={topic} />
            </CardBody>
          </Card>
        </>
      )}
    </MainPage>
  );
}
