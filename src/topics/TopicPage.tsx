import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import topicsActions from "./topicsActions";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import {
  Card,
  CardBody,
  Divider,
  Button,
  Label,
  CodeBlock,
  CodeBlockCode,
  CodeBlockAction,
  CardTitle,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton, ComponentStateLabel } from "ui";
import { AppDispatch } from "store";
import { IEnhancedTopic } from "types";
import { useParams } from "react-router-dom";
import EditTopicModal from "./EditTopicModal";
import productsActions from "products/productsActions";
import { getProducts } from "products/productsSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import CardLine from "ui/CardLine";
import { getTopicById } from "./topicsSelectors";
import ComponentsTableWithToolbar from "./ComponentsTableWithToolbar";

function TopicDetails({ topic }: { topic: IEnhancedTopic }) {
  const [seeData, setSeeData] = useState(false);
  const topicData = isEmpty(topic.data)
    ? "{}"
    : JSON.stringify(topic?.data, null, 2);

  return (
    <Card>
      <CardTitle>Topic details</CardTitle>
      <CardBody>
        <CardLine className="p-md" field="ID" value={topic.id} />
        <Divider />
        <CardLine className="p-md" field="Name" value={topic.name} />
        <Divider />
        <CardLine
          className="p-md"
          field="Access restricted"
          help={
            topic.export_control
              ? "This topic has been validated by the legal team. All its components are accessible."
              : "This topic has not yet been validated by the legal team. All of these components are restricted."
          }
          value={
            topic.export_control ? (
              <Label color="green">no</Label>
            ) : (
              <Label color="red">yes</Label>
            )
          }
        />
        <Divider />
        <CardLine
          className="p-md"
          field="State"
          value={<ComponentStateLabel state={topic.state} />}
        />
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
          <ComponentsTableWithToolbar topic={topic} />
        </>
      )}
    </MainPage>
  );
}
