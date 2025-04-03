import { useState } from "react";
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
  PageSection,
  Content,
} from "@patternfly/react-core";
import { Breadcrumb, CopyButton, EmptyState, StateLabel } from "ui";
import { ITopic } from "types";
import { useParams } from "react-router";
import CardLine from "ui/CardLine";
import { useGetTopicQuery, useUpdateTopicMutation } from "./topicsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import EditTopicModal from "./EditTopicModal";
import ComponentsTableWithToolbar from "./ComponentsTableWithToolbar";
import { fromNow } from "services/date";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";

function stringifyTopicData(topic: ITopic) {
  try {
    return JSON.stringify(topic.data, null, 2);
  } catch (error) {
    return "{}";
  }
}

function TopicDetails({ topic }: { topic: ITopic }) {
  const [seeData, setSeeData] = useState(false);
  const topicData = stringifyTopicData(topic);

  return (
    <Card>
      <CardTitle>Topic details</CardTitle>
      <CardBody>
        <CardLine className="pf-v6-u-p-md" field="ID" value={topic.id} />
        <Divider />
        <CardLine className="pf-v6-u-p-md" field="Name" value={topic.name} />
        <Divider />
        <CardLine
          className="pf-v6-u-p-md"
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
          className="pf-v6-u-p-md"
          field="State"
          value={<StateLabel state={topic.state} />}
        />
        <Divider />
        <CardLine
          className="pf-v6-u-p-md"
          field="Created"
          value={
            <time dateTime={topic.created_at} title={topic.created_at}>
              {fromNow(topic.created_at)}
            </time>
          }
        />
        <Divider />
        <CardLine
          className="pf-v6-u-p-md"
          field="Data"
          value={
            seeData ? (
              <Button
                onClick={() => setSeeData(false)}
                type="button"
                variant="tertiary"
              >
                hide content
              </Button>
            ) : (
              <Button
                onClick={() => setSeeData(true)}
                type="button"
                variant="tertiary"
              >
                see content
              </Button>
            )
          }
        />
        {seeData && (
          <CodeBlock
            actions={[
              <CodeBlockAction key="code-block-1">
                <CopyButton text={topicData} variant="plain" />
              </CodeBlockAction>,
            ]}
          >
            <CodeBlockCode id="topic.data">{topicData}</CodeBlockCode>
          </CodeBlock>
        )}
        <Divider />
        <CardLine
          className="pf-v6-u-p-md"
          field="Component types"
          value={topic.component_types.join(" - ")}
        />
      </CardBody>
    </Card>
  );
}

export default function TopicPage() {
  const { currentUser } = useAuth();
  const { topic_id } = useParams();

  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();
  const { data: topic, isLoading } = useGetTopicQuery(
    topic_id ? topic_id : skipToken,
  );

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!topic) {
    return (
      <EmptyState
        title="There is no topic"
        info={`There is not topic with id ${topic_id}`}
      />
    );
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/topics", title: "Topics" },
          { to: `/topics/${topic_id}/components`, title: topic_id },
        ]}
      />
      <Content component="h1">{`Topic ${topic.name}`}</Content>
      <Content component="p">{`Details page for topic ${topic.name}`}</Content>
      {currentUser?.isSuperAdmin ? (
        <div className="pf-v6-u-mb-md">
          <EditTopicModal
            topic={topic}
            onSubmit={updateTopic}
            isDisabled={isUpdating}
          />
        </div>
      ) : null}
      <TopicDetails topic={topic} />
      <ComponentsTableWithToolbar topic={topic} />
    </PageSection>
  );
}
