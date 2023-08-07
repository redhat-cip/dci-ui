import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
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
  const [isTeamSelectOpen, setIsTeamSelectOpen] = useState(false);
  const [isTopicSelectOpen, setIsTopicSelectOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="pf-v5-u-mt-xl">
      <Flex>
        <FlexItem>Allow</FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.typeahead}
            onToggle={(_event, val) => setIsTeamSelectOpen(val)}
            onSelect={(event, selection) => {
              setIsTeamSelectOpen(false);
              setTeam(selection as ITeam);
            }}
            onClear={() => setTeam(null)}
            selections={team === null ? "" : team.name}
            isOpen={isTeamSelectOpen}
            aria-labelledby="select"
            placeholderText={team === null ? "..." : team.name}
            maxHeight="220px"
          >
            {teams
              .map((t) => ({ ...t, toString: () => t.name }))
              .map((team) => (
                <SelectOption key={team.id} value={team} />
              ))}
          </Select>
        </FlexItem>
        <FlexItem>to download every components from</FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.typeahead}
            onToggle={(_event, val) => setIsTopicSelectOpen(val)}
            onSelect={(event, selection) => {
              setIsTopicSelectOpen(false);
              setTopic(selection as ITopic);
            }}
            onClear={() => setTopic(null)}
            selections={topic === null ? "" : topic.name}
            isOpen={isTopicSelectOpen}
            aria-labelledby="select"
            placeholderText={topic === null ? "..." : topic.name}
            maxHeight="220px"
          >
            {topics
              .map((t) => ({ ...t, toString: () => t.name }))
              .map((topic) => (
                <SelectOption key={topic.id} value={topic} />
              ))}
          </Select>
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
                        `Can't grant permission to ${team.name} for topic ${topic.name}`,
                      ),
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
