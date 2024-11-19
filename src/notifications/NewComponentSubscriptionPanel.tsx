import { sortTopicWithSemver } from "topics/topicsActions";
import {
  useListSubscribedTopicsQuery,
  useListTopicsQuery,
  useSubscribeToATopicMutation,
  useUnsubscribeFromATopicMutation,
} from "topics/topicsApi";
import {
  SearchInput,
  DualListSelector,
  DualListSelectorControl,
  DualListSelectorControlsWrapper,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorPane,
} from "@patternfly/react-core";
import { useState } from "react";
import { AngleLeftIcon, AngleRightIcon } from "@patternfly/react-icons";
import { ITopic } from "types";

export default function NewComponentSubscriptionPanel() {
  const [searchTopics, setSearchTopics] = useState("");
  const [searchSubscribedTopics, setSearchSubscribedTopics] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<ITopic | null>(null);
  const { data: topicsData } = useListTopicsQuery();
  const { data: subscribedTopicsData } = useListSubscribedTopicsQuery();
  const [subscribeToATopic] = useSubscribeToATopicMutation();
  const [unsubscribeFromATopic] = useUnsubscribeFromATopicMutation();

  if (!topicsData || !subscribedTopicsData) return null;

  const subscribedTopicsIds = subscribedTopicsData.topics.map((r) => r.id);
  const availableTopics = topicsData.topics
    .filter((t) => !subscribedTopicsIds.includes(t.id))
    .filter((t) => t.state === "active")
    .filter((topic) =>
      topic.name.toLowerCase().includes(searchTopics.toLowerCase()),
    )
    .sort(sortTopicWithSemver);

  const canSubscribeToSelectedTopic =
    selectedTopic !== null && subscribedTopicsIds.includes(selectedTopic.id);

  return (
    <DualListSelector id="dual-list-selector-topic-notification">
      <DualListSelectorPane
        title="Available topics"
        searchInput={
          <SearchInput
            value={searchTopics}
            onChange={(e, value) => setSearchTopics(value)}
            onClear={() => setSearchTopics("")}
          />
        }
      >
        <DualListSelectorList>
          {availableTopics.map((topic, index) => (
            <DualListSelectorListItem
              key={index}
              id={`composable-available-topic-${index}`}
              onOptionSelect={(e) => setSelectedTopic(topic)}
              isSelected={topic.id === selectedTopic?.id}
            >
              {topic.name}
            </DualListSelectorListItem>
          ))}
        </DualListSelectorList>
      </DualListSelectorPane>

      <DualListSelectorControlsWrapper>
        <DualListSelectorControl
          isDisabled={canSubscribeToSelectedTopic}
          onClick={() => {
            if (selectedTopic) {
              subscribeToATopic(selectedTopic);
            }
          }}
          aria-label="Subscribe to topic"
          tooltipContent="Subscribe to topic"
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!canSubscribeToSelectedTopic}
          onClick={() => {
            if (selectedTopic) {
              unsubscribeFromATopic(selectedTopic);
            }
          }}
          aria-label="Unsubscribe to topic"
          tooltipContent="Unsubscribe to topic"
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>

      <DualListSelectorPane
        isChosen
        title="Subscribed topics"
        searchInput={
          <SearchInput
            value={searchSubscribedTopics}
            onChange={(e, value) => setSearchSubscribedTopics(value)}
            onClear={() => setSearchSubscribedTopics("")}
          />
        }
      >
        <DualListSelectorList>
          {subscribedTopicsData.topics
            .filter((topic) =>
              topic.name
                .toLowerCase()
                .includes(searchSubscribedTopics.toLowerCase()),
            )
            .map((topic, index) => (
              <DualListSelectorListItem
                key={index}
                id={`composable-subscribed-topic-${index}`}
                onOptionSelect={(e) => setSelectedTopic(topic)}
                isSelected={topic.id === selectedTopic?.id}
              >
                {topic.name}
              </DualListSelectorListItem>
            ))}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
}
