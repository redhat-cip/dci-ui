import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import topicsActions, { fetchLatestComponents } from "./topicsActions";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { Pre } from "jobs/jobStates/JobStateComponents";
import {
  PageSection,
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Divider,
  Button,
  Label,
  Tooltip,
} from "@patternfly/react-core";
import { EmptyState } from "ui";
import styled from "styled-components";
import EditTopicButton from "./EditTopicButton";
import { getTopicById } from "./topicsSelectors";
import Component from "./Component";
import { InfoCircleIcon } from "@patternfly/react-icons";

const Padding = styled.div`
  padding: 1em;
`;

const Field = styled.span`
  color: #72767b;
  font-weight: bold;
`;

const YesNoLabelInverted = ({ value }) => {
  return value ? (
    <Label color="red">yes</Label>
  ) : (
    <Label color="green">no</Label>
  );
};

const SeeContent = ({ content }) => {
  const [seeContent, setSeeContent] = useState(false);
  return seeContent ? (
    <div>
      <Button
        onClick={() => setSeeContent(false)}
        type="button"
        variant="tertiary"
        className="mb-md"
      >
        hide content
      </Button>
      <Pre>{content}</Pre>
    </div>
  ) : (
    <Button
      onClick={() => setSeeContent(true)}
      type="button"
      variant="tertiary"
    >
      see content
    </Button>
  );
};

const Line = ({ field, help, value }) => {
  return (
    <Grid hasGutter>
      <GridItem span={4}>
        <div>
          <Field>
            {field}
            {help && (
              <Tooltip position="right" content={<div>{help}</div>}>
                <span className="ml-xs">
                  <InfoCircleIcon />
                </span>
              </Tooltip>
            )}
          </Field>
        </div>
      </GridItem>
      <GridItem span={8}>{value}</GridItem>
    </Grid>
  );
};

const ComponentsContainer = styled.div`
  padding-top: 1em;
`;

const Components = ({ topic }) => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(true);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    dispatch(fetchLatestComponents(topic))
      .then((response) => setComponents(response.data.components))
      .catch((error) => console.log(error))
      .then(() => setIsFetching(false));
  }, [dispatch, topic, setIsFetching]);

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
};

const TopicPage = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = match.params;
  const [isFetching, setIsFetching] = useState(true);
  const topic = useSelector(getTopicById(id));

  useEffect(() => {
    dispatch(topicsActions.one(id, { embed: "next_topic,product" }))
      .then((response) => response.data.topic)
      .catch((error) => console.log(error))
      .then(() => setIsFetching(false));
    dispatch(topicsActions.all());
  }, [dispatch, id, setIsFetching]);

  return (
    <Page
      title={topic ? `Topic ${topic.name}` : "Topic"}
      loading={isFetching && isEmpty(topic)}
      empty={!isFetching && isEmpty(topic)}
      description={topic ? `Details page for topic ${topic.name}` : ""}
      HeaderButton={topic ? <EditTopicButton topic={topic} /> : null}
      EmptyComponent={
        <EmptyState
          title="There is no topic"
          info={`There is not topic with id ${id}`}
        />
      }
    >
      <PageSection>
        {isEmpty(topic) ? null : (
          <Card>
            <CardBody>
              <Padding>
                <Title headingLevel="h3" size="xl">
                  Topic information
                </Title>
              </Padding>
              <Divider />
              <Padding>
                <Line field="ID" value={topic.id} />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Name" value={topic.name} />
              </Padding>
              <Divider />
              <Padding>
                <Line
                  field="Access restricted"
                  help="This topic has not yet been validated by the legal team. All of these components are restricted."
                  value={<YesNoLabelInverted value={!topic.export_control} />}
                />
              </Padding>
              <Divider />
              <Padding>
                <Line field="State" value={topic.state} />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Created" value={topic.from_now} />
              </Padding>
              <Divider />
              <Padding>
                <Line
                  field="Data"
                  value={
                    isEmpty(topic.data) ? (
                      "{}"
                    ) : (
                      <SeeContent
                        content={JSON.stringify(topic.data, null, 2)}
                      />
                    )
                  }
                />
              </Padding>
              <Divider />
              <Padding>
                {topic.product && (
                  <Line field="Product" value={topic.product.name} />
                )}
              </Padding>
              <Divider />
              <Padding>
                <Line field="Components" value={<Components topic={topic} />} />
              </Padding>
              <Divider />
              <Padding>
                <Line
                  field="Component types"
                  value={topic.component_types.join(" - ")}
                />
              </Padding>
            </CardBody>
          </Card>
        )}
      </PageSection>
    </Page>
  );
};

export default TopicPage;
