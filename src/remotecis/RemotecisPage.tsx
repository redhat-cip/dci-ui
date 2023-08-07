import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import remotecisActions from "./remotecisActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import {
  getNbOfRemotecis,
  getRemotecisForTeam,
  isFetchingRemotecis,
} from "./remotecisSelectors";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import {
  Button,
  Label,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { TrashIcon, UserSecretIcon } from "@patternfly/react-icons";
import { AppDispatch } from "store";
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";
import { useAuth } from "auth/authContext";
import { IPaginationFilters } from "types";
import { getLimitAndOffset } from "jobs/toolbar/filters";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

const initialRemoteciFilter = {
  page: 1,
  perPage: 20,
};

export default function RemotecisPage() {
  const { identity } = useAuth();
  const remotecis = useSelector(getRemotecisForTeam(identity?.team));
  const nbOfRemotecis = useSelector(getNbOfRemotecis);
  const isFetching = useSelector(isFetchingRemotecis);
  const dispatch = useDispatch<AppDispatch>();
  const [filters, setFilters] = useState<IPaginationFilters>({
    ...initialRemoteciFilter,
  });

  useEffect(() => {
    const params = {
      where: `team_id:${identity?.team?.id}`,
      ...getLimitAndOffset(filters),
    };
    dispatch(remotecisActions.clear());
    dispatch(remotecisActions.all(params));
  }, [dispatch, filters, identity?.team]);

  if (identity === null) return null;

  return (
    <MainPage
      title="Remotecis"
      description="The remote ci will host the agent. It is recommended to create a remote ci per lab."
      loading={isFetching && isEmpty(remotecis)}
      empty={!isFetching && isEmpty(remotecis)}
      HeaderButton={
        identity.team && (
          <CreateRemoteciModal
            teams={Object.values(identity.teams)}
            onSubmit={(newRemoteci) => {
              dispatch(remotecisActions.create(newRemoteci));
            }}
          />
        )
      }
      EmptyComponent={
        <EmptyState
          title="There is no remotecis"
          info={
            identity.team
              ? `There is no remotecis in ${identity.team.name} team. Do you want to create one?`
              : "Apparently you are not on any team. Contact your EPM or DCI team if you think this is an error."
          }
        />
      }
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Remotecis" }]}
        />
      }
    >
      <Toolbar id="toolbar-remotecis" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignRight" }}>
              {nbOfRemotecis === 0 ? null : (
                <Pagination
                  perPage={filters.perPage}
                  page={filters.page}
                  itemCount={nbOfRemotecis}
                  onSetPage={(e, newPage) => {
                    setFilters({
                      ...filters,
                      page: newPage,
                    });
                  }}
                  onPerPageSelect={(e, newPerPage) => {
                    setFilters({
                      ...filters,
                      perPage: newPerPage,
                    });
                  }}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
        <Thead>
          <Tr>
            <Th className="text-center">ID</Th>
            <Th>Name</Th>
            <Th className="text-center">Status</Th>
            <Th className="text-center" title="Authentication">
              <UserSecretIcon className="pf-v5-u-mr-xs" /> Authentication
            </Th>
            <Th className="text-center">Team</Th>
            <Th>Created</Th>
            <Th className="text-center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {remotecis.map((remoteci) => (
            <Tr key={`${remoteci.id}.${remoteci.etag}`}>
              <Td className="text-center">
                <CopyButton text={remoteci.id} />
              </Td>
              <Td>{remoteci.name}</Td>
              <Td className="text-center">
                {remoteci.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </Td>
              <Td className="text-center">
                <SeeAuthentificationFileModal
                  type="sh"
                  role="remoteci"
                  resource={remoteci}
                  className="pf-v5-u-mr-xs"
                />
                <SeeAuthentificationFileModal
                  type="yaml"
                  role="remoteci"
                  resource={remoteci}
                />
              </Td>
              <Td className="text-center">{remoteci?.team?.name}</Td>
              <Td>{remoteci.from_now}</Td>
              <Td className="text-center">
                <EditRemoteciModal
                  className="pf-v5-u-mr-xs"
                  remoteci={remoteci}
                  teams={Object.values(identity.teams)}
                  onSubmit={(editedRemoteci) => {
                    dispatch(remotecisActions.update(editedRemoteci));
                  }}
                />
                <ConfirmDeleteModal
                  title={`Delete remoteci ${remoteci.name} ?`}
                  message={`Are you sure you want to delete ${remoteci.name}?`}
                  onOk={() => dispatch(remotecisActions.delete(remoteci))}
                >
                  {(openModal) => (
                    <Button size="sm" variant="danger" onClick={openModal}>
                      <TrashIcon />
                    </Button>
                  )}
                </ConfirmDeleteModal>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </MainPage>
  );
}
