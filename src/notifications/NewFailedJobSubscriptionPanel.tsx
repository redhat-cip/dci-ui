import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import remotecisActions from "remotecis/remotecisActions";
import { ICurrentUser, IRemoteci } from "types";
import {
  getSubscribedRemotecis,
  subscribeToARemoteci,
  unsubscribeFromARemoteci,
} from "currentUser/currentUserActions";
import { AppDispatch } from "store";
import { AxiosPromise } from "axios";
import { showAPIError, showError } from "alerts/alertsActions";
import "@patternfly/patternfly/components/DualListSelector/dual-list-selector.css";

type Selectable<T> = T & { id: string; selected: boolean };

export default function NewFailedJobSubscriptionPanel({
  currentUser,
}: {
  currentUser: ICurrentUser;
}) {
  const [availableRemotecis, setAvailableRemotecis] = useState<
    Selectable<IRemoteci>[]
  >([]);
  const [subscribedRemotecis, setSubscribedRemotecis] = useState<
    Selectable<IRemoteci>[]
  >([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getRemotecisPromise = dispatch(
      remotecisActions.all({ where: `team_id:${currentUser.team?.id}` })
    ) as AxiosPromise<{ remotecis: IRemoteci[] }>;
    const getSubscribedRemotecisPromise = getSubscribedRemotecis(currentUser);
    Promise.all([getRemotecisPromise, getSubscribedRemotecisPromise]).then(
      (values) => {
        const subscribedRemotecisIds = values[1].data.remotecis.map(
          (r) => r.id
        );
        setAvailableRemotecis(
          values[0].data.remotecis
            .filter((r) => !subscribedRemotecisIds.includes(r.id))
            .map((r) => ({ ...r, selected: false }))
        );
        setSubscribedRemotecis(
          values[1].data.remotecis.map((r) => ({ ...r, selected: false }))
        );
      }
    );
  }, [dispatch, currentUser]);

  function toggleSelection<T>(items: Selectable<T>[], item: Selectable<T>) {
    return items.map((i) => {
      if (i.id === item.id) {
        return { ...i, selected: !i.selected };
      }
      return i;
    });
  }

  const nbOfSelectedAvailableRemotecis = availableRemotecis.reduce((acc, r) => {
    if (r.selected) {
      acc++;
    }
    return acc;
  }, 0);

  const nbOfSelectedSubscribedRemotecis = subscribedRemotecis.reduce(
    (acc, r) => {
      if (r.selected) {
        acc++;
      }
      return acc;
    },
    0
  );

  return (
    <div className="pf-c-dual-list-selector">
      <div className="pf-c-dual-list-selector__pane pf-m-available">
        <div className="pf-c-dual-list-selector__header">
          <div className="pf-c-dual-list-selector__title">
            <div className="pf-c-dual-list-selector__title-text">
              Available remotecis
            </div>
          </div>
        </div>
        <div className="pf-c-dual-list-selector__status">
          <span
            className="pf-c-dual-list-selector__status-text"
            id="available-remotecis-list"
          >
            {nbOfSelectedAvailableRemotecis} of {availableRemotecis.length}{" "}
            remotecis selected
          </span>
        </div>
        <div className="pf-c-dual-list-selector__menu">
          <ul
            className="pf-c-dual-list-selector__list"
            role="listbox"
            aria-labelledby="available-remotecis-list"
            aria-multiselectable="true"
          >
            {availableRemotecis.map((availableRemoteci) => (
              <li
                key={availableRemoteci.id}
                className="pf-c-dual-list-selector__list-item"
                role="option"
                aria-selected={availableRemoteci.selected}
                onClick={() =>
                  setAvailableRemotecis(
                    toggleSelection(availableRemotecis, availableRemoteci)
                  )
                }
                onKeyDown={() =>
                  setAvailableRemotecis(
                    toggleSelection(availableRemotecis, availableRemoteci)
                  )
                }
              >
                <div
                  className={`pf-c-dual-list-selector__list-item-row ${
                    availableRemoteci.selected ? "pf-m-selected" : ""
                  }`}
                >
                  <span className="pf-c-dual-list-selector__item">
                    <span className="pf-c-dual-list-selector__item-main">
                      <span className="pf-c-dual-list-selector__item-text">
                        {availableRemoteci.name}
                      </span>
                    </span>
                    <span className="pf-c-dual-list-selector__item-count">
                      <span className="pf-c-badge pf-m-read"></span>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pf-c-dual-list-selector__controls">
        <div className="pf-c-dual-list-selector__controls-item">
          <button
            className="pf-c-button pf-m-plain"
            type="button"
            disabled={nbOfSelectedAvailableRemotecis === 0}
            aria-label="Add selected"
            onClick={() => {
              const newSubscribedRemotecis = availableRemotecis.filter(
                (r) => r.selected
              );
              const subscriptions = newSubscribedRemotecis.map(
                (availableRemoteci) =>
                  subscribeToARemoteci(availableRemoteci.id, currentUser)
              );
              Promise.all(subscriptions)
                .then(() => {
                  setAvailableRemotecis(
                    availableRemotecis.filter((r) => !r.selected)
                  );
                  setSubscribedRemotecis(
                    subscribedRemotecis
                      .concat(newSubscribedRemotecis)
                      .map((r) => ({ ...r, selected: false }))
                  );
                })
                .catch((error) => {
                  dispatch(
                    showError("Something went wrong during the subscription")
                  );
                  dispatch(showAPIError(error));
                });
            }}
          >
            <i className="fas fa-fw fa-angle-right"></i>
          </button>
        </div>
        <div className="pf-c-dual-list-selector__controls-item">
          <button
            className="pf-c-button pf-m-plain"
            type="button"
            disabled={nbOfSelectedSubscribedRemotecis === 0}
            aria-label="Remove selected"
            onClick={() => {
              const newUnsubscribedRemoteci = subscribedRemotecis.filter(
                (r) => r.selected
              );
              const unsubscriptions = newUnsubscribedRemoteci.map(
                (availableRemoteci) =>
                  unsubscribeFromARemoteci(availableRemoteci.id, currentUser)
              );
              Promise.all(unsubscriptions)
                .then(() => {
                  setAvailableRemotecis(
                    availableRemotecis
                      .concat(newUnsubscribedRemoteci)
                      .map((r) => ({ ...r, selected: false }))
                  );
                  setSubscribedRemotecis(
                    subscribedRemotecis.filter((r) => !r.selected)
                  );
                })
                .catch((error) => {
                  dispatch(
                    showError("Something went wrong while unsubscribing")
                  );
                  dispatch(showAPIError(error));
                });
            }}
          >
            <i className="fas fa-fw fa-angle-left"></i>
          </button>
        </div>
      </div>
      <div className="pf-c-dual-list-selector__pane pf-m-chosen">
        <div className="pf-c-dual-list-selector__header">
          <div className="pf-c-dual-list-selector__title">
            <div className="pf-c-dual-list-selector__title-text">
              Subscribed remotecis
            </div>
          </div>
        </div>
        <div className="pf-c-dual-list-selector__status">
          <span
            className="pf-c-dual-list-selector__status-text"
            id="subcribed-remotecis-list"
          >
            {nbOfSelectedSubscribedRemotecis} of {subscribedRemotecis.length}{" "}
            remotecis selected
          </span>
        </div>
        <div className="pf-c-dual-list-selector__menu">
          <ul
            className="pf-c-dual-list-selector__list"
            role="listbox"
            aria-labelledby="subcribed-remotecis-list"
            aria-multiselectable="true"
          >
            {subscribedRemotecis.map((subscribedRemoteci) => (
              <li
                key={subscribedRemoteci.id}
                className="pf-c-dual-list-selector__list-item"
                role="option"
                aria-selected={subscribedRemoteci.selected}
                onClick={() =>
                  setSubscribedRemotecis(
                    toggleSelection(subscribedRemotecis, subscribedRemoteci)
                  )
                }
                onKeyDown={() =>
                  setSubscribedRemotecis(
                    toggleSelection(subscribedRemotecis, subscribedRemoteci)
                  )
                }
              >
                <div
                  className={`pf-c-dual-list-selector__list-item-row ${
                    subscribedRemoteci.selected ? "pf-m-selected" : ""
                  }`}
                >
                  <span className="pf-c-dual-list-selector__item">
                    <span className="pf-c-dual-list-selector__item-main">
                      <span className="pf-c-dual-list-selector__item-text">
                        {subscribedRemoteci.name}
                      </span>
                    </span>
                    <span className="pf-c-dual-list-selector__item-count">
                      <span className="pf-c-badge pf-m-read"></span>
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
