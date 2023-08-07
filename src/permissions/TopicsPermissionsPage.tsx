import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uniqBy } from "lodash";
import { Button, TextContent, Text } from "@patternfly/react-core";
import { TrashIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import {
  getTopicsWithTeams,
  removeTeamTopicPermission,
} from "./permissionsActions";
import { ITopicWithTeams } from "types";
import { AppDispatch } from "store";
import AllowTeamToAccessTopicForm from "./AllowTeamToAccessTopicForm";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { global_warning_color_100 } from "@patternfly/react-tokens";
import { Table, Tr, Tbody, Td } from "@patternfly/react-table";

export default function TopicsPermissionsPage() {
  const [topics, setTopics] = useState<ITopicWithTeams[]>([]);
  const restrictedTopics = topics
    .filter((t) => t.state === "active")
    .filter((t) => t.export_control === false);
  const teams = useSelector(getTeams);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getTopicsWithTeams())
      .then(setTopics)
      .finally(() => setIsFetching(false));
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <div>
      {isFetching ? (
        <div className="py-md">loading...</div>
      ) : (
        <div>
          <TextContent className="pf-v5-u-mt-lg">
            <Text component="p">
              <div
                style={{
                  backgroundColor: global_warning_color_100.value,
                  padding: "1em",
                }}
              >
                <WarningTriangleIcon className="pf-v5-u-mr-xs" />
                Some topics are under the export control policy. Some partners
                outside the US need an explicit approval. Make sure the partner
                has the rights before giving it permission to access a
                restricted topic.
              </div>
            </Text>
          </TextContent>
          <AllowTeamToAccessTopicForm
            teams={teams}
            topics={restrictedTopics}
            onClick={(team, topic) => {
              const newTopics = topics.map((p) => {
                if (p.id === topic.id) {
                  p.teams = uniqBy([...p.teams, team], "id");
                }
                return p;
              });
              setTopics(newTopics);
            }}
          />
          {restrictedTopics.map((topic) => {
            return (
              <TextContent
                key={`${topic.id}.${topic.etag}`}
                className="pf-v5-u-mt-lg"
              >
                <Text component="h1">{topic.name}</Text>
                <Text component="p">
                  {topic.teams.length === 0 ? (
                    <span>There is no permission for {topic.name}</span>
                  ) : (
                    <span>List of teams that have access to {topic.name}</span>
                  )}
                </Text>
                <Table
                  className="pf-v5-c-table pf-m-grid-md pf-m-compact"
                  role="grid"
                >
                  <Tbody>
                    {topic.teams.map((team) => (
                      <Tr key={`${team.id}.${team.etag}`}>
                        <Td className="pf-m-width-30">{team.name}</Td>
                        <Td className="pf-m-width-70">
                          <Button
                            variant="secondary"
                            isDanger
                            icon={<TrashIcon />}
                            onClick={() =>
                              dispatch(
                                removeTeamTopicPermission(team, topic),
                              ).then(() => {
                                const newTopics = topics.map((p) => {
                                  if (p.id === topic.id) {
                                    p.teams = p.teams.filter(
                                      (t) => t.id !== team.id,
                                    );
                                  }
                                  return p;
                                });
                                setTopics(newTopics);
                              })
                            }
                          >
                            remove {team.name} permission
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TextContent>
            );
          })}
        </div>
      )}
    </div>
  );
}
