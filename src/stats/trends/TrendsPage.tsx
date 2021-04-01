import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { getTopics } from "topics/topicsSelectors";
import { getTrends } from "./trendsActions";
import { Page } from "layout";
import TrendGraph from "./TrendGraph";
import { EmptyState } from "ui";
import { DateTime } from "luxon";
import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  GalleryItem,
  PageSection,
} from "@patternfly/react-core";
import { ITopic, ITrends, ITrend } from "types";
import { AppDispatch } from "store";
import topicsActions from "topics/topicsActions";

function filterTrends(trends: ITrend[], nbMonth: number) {
  if (isEmpty(trends)) return [];
  return trends
    .sort((t1, t2) => t1[0] - t2[0])
    .filter(
      (d) =>
        DateTime.local().diff(DateTime.fromSeconds(d[0])).as("months") < nbMonth
    );
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<ITrends | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const nbMonth = 6;

  const topics = useSelector(getTopics);
  const [selectedTopic, setSelectedTopic] = useState<ITopic | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    Promise.all([dispatch(topicsActions.all()), getTrends()])
      .then((values) => {
        setTrends(values[1].data.topics);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [dispatch]);

  const xMin = DateTime.local().minus({ months: nbMonth }).toJSDate();
  const xMax = DateTime.local().toJSDate();

  return (
    <Page
      title="Trends"
      description="The number of jobs in success for all partners using DCI. Click on a topic to see more details"
      loading={isFetching && isEmpty(trends)}
      empty={!isFetching && isEmpty(trends)}
      EmptyComponent={
        <EmptyState
          title="There is no trends"
          info="Add some jobs to see trends"
        />
      }
    >
      <PageSection>
        {selectedTopic === null ? (
          <Gallery hasGutter>
            {topics.map((topic) => {
              if (trends === null) return null;
              const filteredTrends = filterTrends(trends[topic.id], nbMonth);
              if (isEmpty(filteredTrends)) return null;
              return (
                <GalleryItem key={topic.id}>
                  <Card
                    onClick={() => setSelectedTopic(topic)}
                    title="Click to enlarge"
                    className="pointer"
                  >
                    <CardTitle>{topic.name}</CardTitle>
                    <CardBody>
                      <TrendGraph
                        xMin={xMin}
                        xMax={xMax}
                        data={filteredTrends}
                      />
                    </CardBody>
                  </Card>
                </GalleryItem>
              );
            })}
          </Gallery>
        ) : (
          <Card
            onClick={() => setSelectedTopic(null)}
            title="Click to hide"
            className="pointer"
          >
            <CardTitle>
              {`Successful jobs per day for ${selectedTopic.name} during the last ${nbMonth} months`}
            </CardTitle>
            <CardBody>
              {trends === null ? null : (
                <TrendGraph
                  xMin={xMin}
                  xMax={xMax}
                  data={filterTrends(trends[selectedTopic.id], nbMonth)}
                />
              )}
            </CardBody>
          </Card>
        )}
      </PageSection>
    </Page>
  );
}
