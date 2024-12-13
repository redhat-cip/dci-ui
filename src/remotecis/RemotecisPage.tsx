import { useEffect, useState } from "react";
import {
  CopyButton,
  EmptyState,
  ConfirmDeleteModal,
  Breadcrumb,
  InputFilter,
} from "ui";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import {
  Button,
  Content,
  Label,
  PageSection,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { TrashIcon, UserSecretIcon } from "@patternfly/react-icons";
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";
import { useAuth } from "auth/authSelectors";
import { Filters, ITeam } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ThProps,
} from "@patternfly/react-table";
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

export default function RemotecisPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );

  const sort = (column: string): ThProps["sort"] => {
    const sortColumns: { [key: string]: number } = {
      name: 1,
      created_at: 2,
    };
    const sortColumnKey = filters.sort.replace("-", "");
    const sortByIndex =
      sortColumnKey in sortColumns ? sortColumns[sortColumnKey] : undefined;
    const sortDirection = filters.sort.indexOf("-") === -1 ? "asc" : "desc";
    return {
      sortBy: {
        index: sortByIndex,
        direction: sortDirection,
      },
      onSort: (_event, index, direction) => {
        const sort = `${sortDirection === "asc" ? "-" : ""}${column}`;
        setFilters({ ...filters, sort });
      },
      columnIndex: sortColumns[column],
    };
  };

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/remotecis${newSearch}`, { replace: true });
  }, [navigate, filters]);

  useEffect(() => {
    setFilters((f) => {
      if (currentUser && currentUser.team) {
        return {
          ...f,
          team_id: currentUser.team.id,
        };
      }
      return f;
    });
  }, [currentUser]);

  const { data, isLoading } = useListRemotecisQuery(filters, {
    skip: filters.team_id === null,
  });
  const [createRemoteci, { isLoading: isCreating }] =
    useCreateRemoteciMutation();
  const [updateRemoteci, { isLoading: isUpdating }] =
    useUpdateRemoteciMutation();
  const [deleteRemoteci] = useDeleteRemoteciMutation();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (currentUser === null) return null;

  if (!data) {
    return (
      <EmptyState
        title="There is no remotecis"
        info="Do you want to create one?"
      />
    );
  }

  const count = data._meta.count;
  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Remotecis" }]} />
      <Content component="h1">Remotecis</Content>
      <Content component="p">
        The remote ci will host the agent. It is recommended to create a remote
        ci per lab.
      </Content>
      {currentUser.team && (
        <div className="pf-v6-u-mb-md">
          <CreateRemoteciModal
            teams={Object.values(currentUser.teams) as ITeam[]}
            onSubmit={createRemoteci}
            isDisabled={isCreating}
          />
        </div>
      )}
      <Toolbar id="toolbar-remotecis" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <InputFilter
                search={filters.name || ""}
                placeholder="Search a remoteci"
                onSearch={(name) => {
                  setFilters({
                    ...filters,
                    name,
                  });
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
              {count === 0 ? null : (
                <Pagination
                  perPage={filters.limit}
                  page={offsetAndLimitToPage(filters.offset, filters.limit)}
                  itemCount={count}
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
      {count === 0 ? (
        <EmptyState
          title="There is no remotecis"
          info={
            currentUser.team
              ? `There is no remotecis in ${currentUser.team.name} team. Do you want to create one?`
              : "Apparently you are not on any team. Contact your EPM or DCI team if you think this is an error."
          }
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th className="text-center">ID</Th>
              <Th sort={sort("name")}>Name</Th>
              <Th className="text-center">Status</Th>
              <Th className="text-center" title="Authentication">
                <UserSecretIcon className="pf-v6-u-mr-xs" /> Authentication
              </Th>
              <Th sort={sort("created_at")}>Created</Th>
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
                    teams={Object.values(currentUser.teams) as ITeam[]}
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
                        variant="danger"
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
    </PageSection>
  );
}
