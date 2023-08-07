import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import topicsActions, { sortTopicWithSemver } from "topics/topicsActions";
import { ITopic } from "types";
import {
  getSubscribedTopics,
  subscribeToATopic,
  unsubscribeFromATopic,
} from "currentUser/currentUserActions";
import { AppDispatch } from "store";
import { AxiosPromise } from "axios";
import { showAPIError, showError } from "alerts/alertsActions";
import "@patternfly/patternfly/components/DualListSelector/dual-list-selector.css";

type Selectable<T> = T & { id: string; selected: boolean };

export default function NewComponentSubscriptionPanel() {
  const [availableTopics, setAvailableTopics] = useState<Selectable<ITopic>[]>(
    [],
  );
  const [subscribedTopics, setSubscribedTopics] = useState<
    Selectable<ITopic>[]
  >([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getTopicsPromise = dispatch(
      topicsActions.all({ where: "state:active" }),
    ) as AxiosPromise<{
      topics: ITopic[];
    }>;
    const getSubscribedTopicsPromise = getSubscribedTopics();
    Promise.all([getTopicsPromise, getSubscribedTopicsPromise]).then(
      (values) => {
        const subscribedTopicsIds = values[1].data.topics.map((r) => r.id);
        setAvailableTopics(
          values[0].data.topics
            .filter((r) => !subscribedTopicsIds.includes(r.id))
            .map((r) => ({ ...r, selected: false }))
            .sort(sortTopicWithSemver),
        );
        setSubscribedTopics(
          values[1].data.topics.map((r) => ({ ...r, selected: false })),
        );
      },
    );
  }, [dispatch]);

  function toggleSelection<T>(items: Selectable<T>[], item: Selectable<T>) {
    return items.map((i) => {
      if (i.id === item.id) {
        return { ...i, selected: !i.selected };
      }
      return i;
    });
  }

  const nbOfSelectedAvailableTopics = availableTopics.reduce((acc, r) => {
    if (r.selected) {
      acc++;
    }
    return acc;
  }, 0);

  const nbOfSelectedSubscribedTopics = subscribedTopics.reduce((acc, r) => {
    if (r.selected) {
      acc++;
    }
    return acc;
  }, 0);

  return (
    <div className="pf-v5-c-dual-list-selector">
      <div className="pf-v5-c-dual-list-selector__pane pf-m-available">
        <div className="pf-v5-c-dual-list-selector__header">
          <div className="pf-v5-c-dual-list-selector__title">
            <div className="pf-v5-c-dual-list-selector__title-text">
              Available topics
            </div>
          </div>
        </div>
        <div className="pf-v5-c-dual-list-selector__status">
          <span
            className="pf-v5-c-dual-list-selector__status-text"
            id="available-topics-list"
          >
            {nbOfSelectedAvailableTopics} of {availableTopics.length} topics
            selected
          </span>
        </div>
        <div className="pf-v5-c-dual-list-selector__menu">
          <ul
            className="pf-v5-c-dual-list-selector__list"
            role="listbox"
            aria-labelledby="available-topics-list"
            aria-multiselectable="true"
          >
            {availableTopics.map((availableTopic) => (
              <li
                key={availableTopic.id}
                className="pf-v5-c-dual-list-selector__list-item"
                role="option"
                aria-selected={availableTopic.selected}
                onClick={() =>
                  setAvailableTopics(
                    toggleSelection(availableTopics, availableTopic),
                  )
                }
                onKeyDown={() =>
                  setAvailableTopics(
                    toggleSelection(availableTopics, availableTopic),
                  )
                }
              >
                <div
                  className={`pf-v5-c-dual-list-selector__list-item-row ${
                    availableTopic.selected ? "pf-m-selected" : ""
                  }`}
                >
                  <span className="pf-v5-c-dual-list-selector__item">
                    <span className="pf-v5-c-dual-list-selector__item-main">
                      <span className="pf-v5-c-dual-list-selector__item-text">
                        {availableTopic.name}
                      </span>
                    </span>
                    <span className="pf-v5-c-dual-list-selector__item-count">
                      <span className="pf-v5-c-badge pf-m-read"></span>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pf-v5-c-dual-list-selector__controls">
        <div className="pf-v5-c-dual-list-selector__controls-item">
          <button
            className="pf-v5-c-button pf-m-plain"
            type="button"
            disabled={nbOfSelectedAvailableTopics === 0}
            aria-label="Add selected"
            onClick={() => {
              const newSubscribedTopics = availableTopics.filter(
                (r) => r.selected,
              );
              const subscriptions = newSubscribedTopics.map((availableTopic) =>
                subscribeToATopic(availableTopic.id),
              );
              Promise.all(subscriptions)
                .then(() => {
                  setAvailableTopics(
                    availableTopics.filter((r) => !r.selected),
                  );
                  setSubscribedTopics(
                    subscribedTopics
                      .concat(newSubscribedTopics)
                      .map((r) => ({ ...r, selected: false })),
                  );
                })
                .catch((error) => {
                  dispatch(
                    showError("Something went wrong during the subscription"),
                  );
                  dispatch(showAPIError(error));
                });
            }}
          >
            <i className="fas fa-fw fa-angle-right"></i>
          </button>
        </div>
        <div className="pf-v5-c-dual-list-selector__controls-item">
          <button
            className="pf-v5-c-button pf-m-plain"
            type="button"
            disabled={nbOfSelectedSubscribedTopics === 0}
            aria-label="Remove selected"
            onClick={() => {
              const newUnsubscribedTopic = subscribedTopics.filter(
                (r) => r.selected,
              );
              const unsubscriptions = newUnsubscribedTopic.map(
                (availableTopic) => unsubscribeFromATopic(availableTopic.id),
              );
              Promise.all(unsubscriptions)
                .then(() => {
                  setAvailableTopics(
                    availableTopics
                      .concat(newUnsubscribedTopic)
                      .map((r) => ({ ...r, selected: false }))
                      .sort(sortTopicWithSemver),
                  );
                  setSubscribedTopics(
                    subscribedTopics.filter((r) => !r.selected),
                  );
                })
                .catch((error) => {
                  dispatch(
                    showError("Something went wrong while unsubscribing"),
                  );
                  dispatch(showAPIError(error));
                });
            }}
          >
            <i className="fas fa-fw fa-angle-left"></i>
          </button>
        </div>
      </div>
      <div className="pf-v5-c-dual-list-selector__pane pf-m-chosen">
        <div className="pf-v5-c-dual-list-selector__header">
          <div className="pf-v5-c-dual-list-selector__title">
            <div className="pf-v5-c-dual-list-selector__title-text">
              Subscribed topics
            </div>
          </div>
        </div>
        <div className="pf-v5-c-dual-list-selector__status">
          <span
            className="pf-v5-c-dual-list-selector__status-text"
            id="subcribed-topics-list"
          >
            {nbOfSelectedSubscribedTopics} of {subscribedTopics.length} topics
            selected
          </span>
        </div>
        <div className="pf-v5-c-dual-list-selector__menu">
          <ul
            className="pf-v5-c-dual-list-selector__list"
            role="listbox"
            aria-labelledby="subcribed-topics-list"
            aria-multiselectable="true"
          >
            {subscribedTopics.map((subscribedTopic) => (
              <li
                key={subscribedTopic.id}
                className="pf-v5-c-dual-list-selector__list-item"
                role="option"
                aria-selected={subscribedTopic.selected}
                onClick={() =>
                  setSubscribedTopics(
                    toggleSelection(subscribedTopics, subscribedTopic),
                  )
                }
                onKeyDown={() =>
                  setSubscribedTopics(
                    toggleSelection(subscribedTopics, subscribedTopic),
                  )
                }
              >
                <div
                  className={`pf-v5-c-dual-list-selector__list-item-row ${
                    subscribedTopic.selected ? "pf-m-selected" : ""
                  }`}
                >
                  <span className="pf-v5-c-dual-list-selector__item">
                    <span className="pf-v5-c-dual-list-selector__item-main">
                      <span className="pf-v5-c-dual-list-selector__item-text">
                        {subscribedTopic.name}
                      </span>
                    </span>
                    <span className="pf-v5-c-dual-list-selector__item-count">
                      <span className="pf-v5-c-badge pf-m-read"></span>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
