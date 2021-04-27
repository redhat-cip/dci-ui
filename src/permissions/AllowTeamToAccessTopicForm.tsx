import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { grantTeamTopicPermission } from "./permissionsActions";
import { Flex, FlexItem } from "@patternfly/react-core";
import { ITeam, ITopic } from "types";
import { AppDispatch } from "store";
import { showError } from "alerts/alertsActions";

interface AllowTeamToAccessTopicFormProps {
  teams: ITeam[];
  topics: ITopic[];
  onClick: (team: ITeam, topic: ITopic) => void;
}

export default function AllowTeamToAccessTopicForm({
  teams,
  topics,
  onClick,
}: AllowTeamToAccessTopicFormProps) {
  const [team, setTeam] = useState<ITeam | null>(null);
  const [topic, setTopic] = useState<ITopic | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mt-xl">
      <Flex>
        <FlexItem>Allow</FlexItem>
        <FlexItem>
          <SelectWithSearch
            placeholder={team === null ? "..." : team.name}
            option={team}
            options={teams}
            onClear={() => {
              setTeam(null);
            }}
            onSelect={(team) => setTeam(team as ITeam)}
          />
        </FlexItem>
        <FlexItem>to download every components from</FlexItem>
        <FlexItem>
          <SelectWithSearch
            placeholder={topic === null ? "..." : topic.name}
            option={topic}
            options={topics}
            onClear={() => {
              setTopic(null);
            }}
            onSelect={(resource) => {
              setTopic(resource as ITopic);
            }}
          />
        </FlexItem>
        <FlexItem>topic</FlexItem>
        <FlexItem>
          <Button
            variant="primary"
            isDisabled={team === null || topic === null}
            onClick={() => {
              if (team !== null && topic !== null) {
                dispatch(grantTeamTopicPermission(team, topic))
                  .then(() => {
                    onClick(team, topic);
                  })
                  .catch(() => {
                    dispatch(
                      showError(
                        `Can't grant permission to ${team.name} for topic ${topic.name}`
                      )
                    );
                  });
              }
            }}
          >
            Confirm
          </Button>
        </FlexItem>
      </Flex>
    </div>
  );
}
