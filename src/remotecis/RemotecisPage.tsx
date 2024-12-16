import { useEffect, useState } from "react";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import {
  Button,
  Content,
  Label,
  PageSection,
  Pagination,
  SearchInput,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { TrashIcon, UserSecretIcon } from "@patternfly/react-icons";
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";
import { Filters, IIdentityTeam } from "types";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useLocation, useNavigate } from "react-router";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";
import {
  useCreateRemoteciMutation,
  useDeleteRemoteciMutation,
  useListRemotecisQuery,
  useUpdateRemoteciMutation,
} from "./remotecisApi";
import { fromNow } from "services/date";
import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";

function RemotecisSection({ team }: { team: IIdentityTeam }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    ...parseFiltersFromSearch(location.search),
    team_id: team.id,
  });
  const [inputSearch, setInputSearch] = useState(filters.name || "");

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/remotecis${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isFetching } = useListRemotecisQuery(filters);
  const [updateRemoteci, { isLoading: isUpdating }] =
    useUpdateRemoteciMutation();
  const [deleteRemoteci] = useDeleteRemoteciMutation();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no remotecis" />;
  }

  const remotecisCount = data._meta.count;
  return (
    <>
      <Toolbar id="toolbar-remotecis" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search a remoteci"
                value={inputSearch}
                onChange={(e, search) => setInputSearch(search)}
                onSearch={(e, name) => {
                  if (name.trim().endsWith("*")) {
                    setFilters({
                      ...filters,
                      name,
                    });
                  } else {
                    setFilters({
                      ...filters,
                      name: `${name}*`,
                    });
                  }
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
              {remotecisCount === 0 ? null : (
                <Pagination
                  perPage={filters.limit}
                  page={offsetAndLimitToPage(filters.offset, filters.limit)}
                  itemCount={remotecisCount}
                  onSetPage={(e, newPage) => {
                    setFilters({
                      ...filters,
                      offset: pageAndLimitToOffset(newPage, filters.limit),
                    });
                  }}
                  onPerPageSelect={(e, newPerPage) => {
                    setFilters({ ...filters, limit: newPerPage });
                  }}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {isFetching ? (
        <Skeleton />
      ) : data.remotecis.length === 0 ? (
        inputSearch === "" ? (
          <EmptyState
            title="There is no remotecis"
            info="Do you want to create one?"
          />
        ) : (
          <EmptyState
            title="There is no remotecis"
            info="There is no remotecis matching your search. Please update your search."
          />
        )
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th className="text-center">ID</Th>
              <Th>Name</Th>
              <Th className="text-center">Status</Th>
              <Th className="text-center" title="Authentication">
                <UserSecretIcon className="pf-v6-u-mr-xs" /> Authentication
              </Th>
              <Th>Created</Th>
              <Th className="text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.remotecis.map((remoteci) => (
              <Tr key={`${remoteci.id}.${remoteci.etag}`}>
                <Td isActionCell>
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
                    className="pf-v6-u-mr-xs"
                  />
                  <SeeAuthentificationFileModal
                    type="yaml"
                    role="remoteci"
                    resource={remoteci}
                  />
                </Td>
                <Td>{fromNow(remoteci.created_at)}</Td>
                <Td className="text-center">
                  <EditRemoteciModal
                    className="pf-v6-u-mr-xs"
                    remoteci={remoteci}
                    onSubmit={updateRemoteci}
                    isDisabled={isUpdating}
                  />
                  <ConfirmDeleteModal
                    title={`Delete remoteci ${remoteci.name} ?`}
                    message={`Are you sure you want to delete ${remoteci.name}?`}
                    onOk={() => deleteRemoteci(remoteci)}
                  >
                    {(openModal) => (
                      <Button
                        icon={<TrashIcon />}
                        variant="secondary"
                        isDanger
                        onClick={openModal}
                      ></Button>
                    )}
                  </ConfirmDeleteModal>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}

export default function RemotecisPage() {
  const { currentUser } = useAuth();
  const [createRemoteci, { isLoading: isCreating }] =
    useCreateRemoteciMutation();

  if (!currentUser) return null;

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Remotecis" }]} />
      <Content component="h1">Remotecis</Content>
      <Content component="p">
        The remote ci will host the agent. It is recommended to create a remote
        ci per lab.
      </Content>
      <div className="pf-v6-u-mb-md">
        <CreateRemoteciModal
          onSubmit={createRemoteci}
          isDisabled={isCreating}
        />
      </div>
      {currentUser.team === null ? (
        <EmptyState title="Apparently you are not on any team." />
      ) : (
        <RemotecisSection team={currentUser.team} />
      )}
    </PageSection>
  );
}
