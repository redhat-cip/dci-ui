import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Page } from "layout";
import {
  PageSection,
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Divider,
  Tooltip,
  Label,
} from "@patternfly/react-core";
import { EmptyState } from "ui";
import { AppDispatch } from "store";
import { IComponent } from "types";
import { useRouteMatch, Link } from "react-router-dom";
import { fetchComponent } from "./componentActions";
import styled from "styled-components";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { fromNow } from "services/date";

const Padding = styled.div`
  padding: 1em;
`;

const Field = styled.span`
  color: #72767b;
  font-weight: bold;
`;

interface LineProps {
  field: string;
  help?: string;
  value: React.ReactNode;
}

function Line({ field, help, value }: LineProps) {
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
}

type MatchParams = {
  id: string;
};

export default function ComponentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const match = useRouteMatch<MatchParams>();
  const { id } = match.params;
  const [isFetching, setIsFetching] = useState(true);
  const [component, setComponent] = useState<IComponent | null>(null);

  const getComponentCallback = useCallback(() => {
    dispatch(fetchComponent(id))
      .then((response) => setComponent(response.data.component))
      .finally(() => setIsFetching(false));
  }, [dispatch, id, setIsFetching]);

  useEffect(() => {
    getComponentCallback();
  }, [getComponentCallback]);

  return (
    <Page
      title={
        component
          ? `Component ${component.canonical_project_name}`
          : "Component"
      }
      loading={isFetching && component === null}
      empty={!isFetching && component === null}
      description={
        component
          ? `Details page for component ${component.canonical_project_name}`
          : ""
      }
      EmptyComponent={
        <EmptyState
          title="There is no component"
          info={`There is not component with id ${id}`}
        />
      }
    >
      <PageSection>
        {component === null ? null : (
          <Card>
            <CardBody>
              <Padding>
                <Title headingLevel="h3" size="xl">
                  Component information
                </Title>
              </Padding>
              <Divider />
              <Padding>
                <Line field="ID" value={component.id} />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Name" value={component.canonical_project_name} />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Unique Name" value={component.name} />
              </Padding>
              <Divider />
              <Padding>
                <Line
                  field="Topic id"
                  value={
                    <Link to={`/topics/${component.topic_id}/components`}>
                      {component.topic_id}
                    </Link>
                  }
                />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Type" value={component.type} />
              </Padding>
              <Divider />
              <Padding>
                <Line
                  field="Tags"
                  value={
                    component.tags.length > 0
                      ? component.tags.map((tag, i) => (
                          <Label key={i} className="mt-xs mr-xs" color="blue">
                            {tag}
                          </Label>
                        ))
                      : "no tags"
                  }
                />
              </Padding>
              <Divider />

              <Padding>
                <Line field="State" value={component.state} />
              </Padding>
              <Divider />
              <Padding>
                <Line field="Created" value={fromNow(component.created_at)} />
              </Padding>
            </CardBody>
          </Card>
        )}
      </PageSection>
    </Page>
  );
}
