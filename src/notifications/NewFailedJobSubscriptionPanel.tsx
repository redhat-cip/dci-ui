import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import remotecisActions from "remotecis/remotecisActions";
import { ICurrentUser, IRemoteci } from "types";
import {
  getSubscribedRemotecis,
  subscribeToARemoteci,
  unsubscribeFromARemoteci,
} from "currentUser/currentUserActions";
import { getRemotecis } from "remotecis/remotecisSelectors";
import { AppDispatch } from "store";
import { showError, showSuccess } from "alerts/alertsActions";
import "@patternfly/patternfly/components/DualListSelector/dual-list-selector.css";
import {
  DualListSelector,
  DualListSelectorControl,
  DualListSelectorControlsWrapper,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorPane,
  SearchInput,
} from "@patternfly/react-core";
import { AngleLeftIcon, AngleRightIcon } from "@patternfly/react-icons";

export default function NewFailedJobSubscriptionPanel({
  currentUser,
}: {
  currentUser: ICurrentUser;
}) {
  const [searchRemotecis, setSearchRemotecis] = useState("");
  const [selectedRemoteci, setSelectedRemoteci] = useState<IRemoteci | null>(
    null,
  );
  const remotecis = useSelector(getRemotecis);

  const [searchSubscribedRemotecis, setSearchSubscribedRemotecis] =
    useState("");
  const [subscribedRemotecis, setSubscribedRemotecis] = useState<IRemoteci[]>(
    [],
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(remotecisActions.allPaginated(`team_id:${currentUser.team?.id}`));
  }, [dispatch, currentUser]);

  const memoizedGetSubscribedRemotecis = useCallback(() => {
    getSubscribedRemotecis(currentUser).then((response) => {
      setSubscribedRemotecis(response.data.remotecis);
    });
  }, [currentUser]);

  useEffect(() => {
    memoizedGetSubscribedRemotecis();
  }, [memoizedGetSubscribedRemotecis]);

  const subscribedRemotecisIds = subscribedRemotecis.map(
    (remoteci) => remoteci.id,
  );
  const nbSubscribedRemotecis = subscribedRemotecis.length;
  const visibleRemotecis = useMemo(() => {
    return remotecis
      .filter((remoteci) =>
        remoteci.name.toLowerCase().includes(searchRemotecis.toLowerCase()),
      )
      .filter((remoteci) => {
        if (nbSubscribedRemotecis === 0) {
          return true;
        }
        return !subscribedRemotecisIds.includes(remoteci.id);
      });
  }, [
    remotecis,
    subscribedRemotecisIds,
    searchRemotecis,
    nbSubscribedRemotecis,
  ]);

  const canSubscribeToSelectedRemoteci =
    selectedRemoteci !== null &&
    subscribedRemotecisIds.includes(selectedRemoteci.id);

  return (
    <DualListSelector id="dual-list-selector-remoteci-notification">
      <DualListSelectorPane
        title="Available remotecis"
        searchInput={
          <SearchInput
            value={searchRemotecis}
            onChange={(e, value) => setSearchRemotecis(value)}
            onClear={() => setSearchRemotecis("")}
          />
        }
      >
        <DualListSelectorList>
          {visibleRemotecis.map((remoteci, index) => (
            <DualListSelectorListItem
              key={index}
              id={`composable-available-remoteci-${index}`}
              onOptionSelect={(e) => setSelectedRemoteci(remoteci)}
              isSelected={remoteci.id === selectedRemoteci?.id}
            >
              {remoteci.name}
            </DualListSelectorListItem>
          ))}
        </DualListSelectorList>
      </DualListSelectorPane>

      <DualListSelectorControlsWrapper>
        <DualListSelectorControl
          isDisabled={canSubscribeToSelectedRemoteci}
          onClick={() => {
            if (selectedRemoteci) {
              setSubscribedRemotecis([
                ...subscribedRemotecis,
                selectedRemoteci,
              ]);
              subscribeToARemoteci(selectedRemoteci, currentUser)
                .then(() =>
                  dispatch(
                    showSuccess(
                      `You are subscribed to remoteci ${selectedRemoteci?.name}. You will receive an email when a job fails on this remoteci.`,
                    ),
                  ),
                )
                .catch(() => {
                  dispatch(
                    showError(
                      "We are sorry, we are unable to subscribe to this remoteci. Can you try again in a few minutes or contact an administrator?",
                    ),
                  );
                  memoizedGetSubscribedRemotecis();
                });
            }
          }}
          aria-label="Subscribe to remoteci"
          tooltipContent="Subscribe to remoteci"
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={!canSubscribeToSelectedRemoteci}
          onClick={() => {
            if (selectedRemoteci) {
              setSubscribedRemotecis(
                subscribedRemotecis.filter(
                  (remoteci) => remoteci.id !== selectedRemoteci.id,
                ),
              );
              unsubscribeFromARemoteci(selectedRemoteci, currentUser)
                .then(() =>
                  dispatch(
                    showSuccess(
                      `Unsubscription confirmed. You will no longer receive emails for failed jobs on the ${selectedRemoteci?.name} remoteci.`,
                    ),
                  ),
                )
                .catch(() => {
                  dispatch(
                    showError(
                      "We are sorry, we are unable to unsubscribe from this remoteci. Can you try again in a few minutes or contact an administrator?",
                    ),
                  );
                });
            }
          }}
          aria-label="Unsubscribe to remoteci"
          tooltipContent="Unsubscribe to remoteci"
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>

      <DualListSelectorPane
        isChosen
        title="Subscribed remotecis"
        searchInput={
          <SearchInput
            value={searchSubscribedRemotecis}
            onChange={(e, value) => setSearchSubscribedRemotecis(value)}
            onClear={() => setSearchSubscribedRemotecis("")}
          />
        }
      >
        <DualListSelectorList>
          {subscribedRemotecis
            .filter((remoteci) =>
              remoteci.name
                .toLowerCase()
                .includes(searchSubscribedRemotecis.toLowerCase()),
            )
            .map((remoteci, index) => (
              <DualListSelectorListItem
                key={index}
                id={`composable-subscribed-remoteci-${index}`}
                onOptionSelect={(e) => setSelectedRemoteci(remoteci)}
                isSelected={remoteci.id === selectedRemoteci?.id}
              >
                {remoteci.name}
              </DualListSelectorListItem>
            ))}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
}
