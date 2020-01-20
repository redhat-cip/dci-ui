import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import topicsActions, { fetchLatestComponents } from "./topicsActions";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { Pre } from "jobs/jobStates/JobStateComponents";
import {
  PageSection,
  Card,
  CardHeader,
  Grid,
  GridItem,
  Title,
  Divider,
  Button
} from "@patternfly/react-core";
import { EmptyState, Labels } from "ui";
import styled from "styled-components";
import { CubesIcon } from "@patternfly/react-icons";
import EditTopicButton from "./EditTopicButton";
import { getTopicById } from "./topicsSelectors";

const Padding = styled.div`
  padding: 1em;
`;

const Field = styled.span`
  color: #72767b;
  font-weight: bold;
`;

const ExportControl = ({ export_control }) => {
  return export_control ? (
    <Labels.Success>yes</Labels.Success>
  ) : (
    <Labels.Error>no</Labels.Error>
  );
};

const SeeContent = ({ content }) => {
  const [seeContent, setSeeContent] = useState(false);
  return seeContent ? (
    <div>
      <Button
        onClick={() => setSeeContent(false)}
        type="button"
        className="pf-u-mb-md"
      >
        hide content
      </Button>
      <Pre>{content}</Pre>
    </div>
  ) : (
    <Button onClick={() => setSeeContent(true)} type="button">
      see content
    </Button>
  );
};

const Line = ({ field, value }) => {
  return (
    <Grid gutter="md">
      <GridItem span={3}>
        <Field>{field}</Field>
      </GridItem>
      <GridItem span={9}>{value}</GridItem>
    </Grid>
  );
};

const Components = ({ topic }) => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(true);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    dispatch(fetchLatestComponents(topic))
      .then(response => setComponents(response.data.components))
      .catch(error => console.log(error))
      .then(() => setIsFetching(false));
  }, [dispatch, topic, setIsFetching]);

  if (isFetching) {
    return <div>loading</div>;
  }

  if (isEmpty(components)) {
    return (
      <div className="pf-u-my-xl">
        <EmptyState
          title="There is no component for this topic"
          info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
        />
      </div>
    );
  }

  return (
    <div>
      {components.map(component => (
        <p key={component.id}>
          <CubesIcon /> {component.name}
        </p>
      ))}
    </div>
  );
};

const TopicPage = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = match.params;
  const [isFetching, setIsFetching] = useState(true);
  const topic = useSelector(getTopicById(id));

  useEffect(() => {
    dispatch(topicsActions.one({ id }, { embed: "next_topic,product" }))
      .then(response => response.data.topic)
      .catch(error => console.log(error))
      .then(() => setIsFetching(false));
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
          <Grid gutter="md">
            <GridItem>
              <Card>
                <CardHeader className="pf-u-p-0">
                  <Padding>
                    <Title headingLevel="h3" size="xl">
                      Topic information
                    </Title>
                  </Padding>
                  <Divider />
                  <Padding>
                    <Line field="Id" value={topic.id} />
                  </Padding>
                  <Divider />
                  <Padding>
                    <Line field="Name" value={topic.name} />
                  </Padding>
                  <Divider />
                  <Padding>
                    <Line
                      field="Export control"
                      value={
                        <ExportControl export_control={topic.export_control} />
                      }
                    />
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
                        <SeeContent
                          content={JSON.stringify(topic.data, null, 2)}
                        />
                      }
                    />
                  </Padding>
                  <Divider />
                  <Padding>
                    <Line field="Product" value={topic.product.name} />
                  </Padding>
                  <Divider />
                  <Padding>
                    <Line
                      field="Component types"
                      value={topic.component_types.join(" - ")}
                    />
                  </Padding>

                  <Divider />
                  <Padding>
                    <Line
                      field="Components"
                      value={<Components topic={topic} />}
                    />
                  </Padding>
                </CardHeader>
              </Card>
            </GridItem>
          </Grid>
        )}
      </PageSection>
    </Page>
  );
};

export default TopicPage;
