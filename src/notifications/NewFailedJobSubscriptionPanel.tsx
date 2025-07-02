import { useState } from "react";
import type { ICurrentUser, IRemoteci } from "types";
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
import {
  useListRemotecisQuery,
  useListSubscribedRemotecisQuery,
  useSubscribeToARemoteciMutation,
  useUnsubscribeFromARemoteciMutation,
} from "remotecis/remotecisApi";

export default function NewFailedJobSubscriptionPanel({
  currentUser,
}: {
  currentUser: ICurrentUser;
}) {
  const [searchRemotecis, setSearchRemotecis] = useState("");
  const [searchSubscribedRemotecis, setSearchSubscribedRemotecis] =
    useState("");
  const [selectedRemoteci, setSelectedRemoteci] = useState<IRemoteci | null>(
    null,
  );

  const { data: remotecisData } = useListRemotecisQuery({
    team_id: currentUser.team?.id,
  });

  const { data: subscribedRemotecisData } =
    useListSubscribedRemotecisQuery(currentUser);
  const [subscribeToARemoteci] = useSubscribeToARemoteciMutation();
  const [unsubscribeFromARemoteci] = useUnsubscribeFromARemoteciMutation();

  if (!remotecisData || !subscribedRemotecisData) return null;

  const subscribedRemotecisIds = subscribedRemotecisData.remotecis.map(
    (remoteci) => remoteci.id,
  );
  const nbSubscribedRemotecis = subscribedRemotecisIds.length;
  const visibleRemotecis = remotecisData.remotecis
    .filter((remoteci) =>
      remoteci.name.toLowerCase().includes(searchRemotecis.toLowerCase()),
    )
    .filter((remoteci) => {
      if (nbSubscribedRemotecis === 0) {
        return true;
      }
      return !subscribedRemotecisIds.includes(remoteci.id);
    });
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
            onChange={(_event, value) => setSearchRemotecis(value)}
            onClear={() => setSearchRemotecis("")}
          />
        }
      >
        <DualListSelectorList>
          {visibleRemotecis.map((remoteci, index) => (
            <DualListSelectorListItem
              key={index}
              id={`composable-available-remoteci-${index}`}
              onOptionSelect={() => setSelectedRemoteci(remoteci)}
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
              subscribeToARemoteci({ remoteci: selectedRemoteci, currentUser });
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
              unsubscribeFromARemoteci({
                remoteci: selectedRemoteci,
                currentUser,
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
          {subscribedRemotecisData.remotecis
            .filter((remoteci) =>
              remoteci.name
                .toLowerCase()
                .includes(searchSubscribedRemotecis.toLowerCase()),
            )
            .map((remoteci, index) => (
              <DualListSelectorListItem
                key={index}
                id={`composable-subscribed-remoteci-${index}`}
                onOptionSelect={() => setSelectedRemoteci(remoteci)}
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
