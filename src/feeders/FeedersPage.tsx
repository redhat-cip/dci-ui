import MainPage from "pages/MainPage";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { TrashIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";
import { useNavigate, Link } from "react-router-dom";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useDeleteFeederMutation, useListFeedersQuery } from "./feedersApi";
import { fromNow } from "services/date";
import { useListTeamsQuery } from "teams/teamsApi";

export default function FeedersPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useListFeedersQuery();
  const { data: dataTeams, isLoading: isLoadingTeams } = useListTeamsQuery();

  const [deleteFeeder] = useDeleteFeederMutation();

  if (!data || !dataTeams) return null;

  return (
    <MainPage
      title="Feeders"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      loading={isLoading || isLoadingTeams}
      empty={data.feeders.length === 0}
      HeaderButton={
        <Button variant="primary" onClick={() => navigate("/feeders/create")}>
          <PlusCircleIcon className="pf-v5-u-mr-xs" />
          Create a new feeder
        </Button>
      }
      EmptyComponent={
        <EmptyState
          title="There is no feeders"
          info="Do you want to create one?"
        />
      }
      Breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Feeders" }]} />
      }
    >
      <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
        <Thead>
          <Tr>
            <Th className="text-center">ID</Th>
            <Th>Name</Th>
            <Th>Team Owner</Th>
            <Th className="text-center" title="Authentication">
              Authentication
            </Th>
            <Th className="text-center">Created</Th>
            <Th className="text-center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.feeders.map((feeder) => {
            const team = dataTeams.teams.find(
              (team) => feeder.team_id === team.id,
            );
            return (
              <Tr key={`${feeder.id}.${feeder.etag}`}>
                <Td className="text-center">
                  <CopyButton text={feeder.id} />
                </Td>
                <Td>
                  <Link to={`/feeders/${feeder.id}`}>{feeder.name}</Link>
                </Td>
                <Td>{team === undefined ? null : team.name}</Td>
                <Td className="text-center">
                  <SeeAuthentificationFileModal
                    type="sh"
                    role="feeder"
                    resource={feeder}
                    className="pf-v5-u-mr-xs"
                  />
                  <SeeAuthentificationFileModal
                    type="yaml"
                    role="feeder"
                    resource={feeder}
                  />
                </Td>
                <Td className="text-center">{fromNow(feeder.created_at)}</Td>
                <Td className="text-center">
                  <ConfirmDeleteModal
                    title={`Delete feeder ${feeder.name}`}
                    message={`Are you sure you want to delete ${feeder.name}?`}
                    onOk={() => deleteFeeder(feeder)}
                  >
                    {(openModal) => (
                      <Button variant="danger" onClick={openModal}>
                        <TrashIcon />
                      </Button>
                    )}
                  </ConfirmDeleteModal>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </MainPage>
  );
}
