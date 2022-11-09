import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import remotecisActions from "./remotecisActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { getRemotecisForTeam, isFetchingRemotecis } from "./remotecisSelectors";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import { Button, Label } from "@patternfly/react-core";
import { TrashIcon, UserSecretIcon } from "@patternfly/react-icons";
import { AppDispatch } from "store";
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";
import { useAuth } from "auth/authContext";

export default function RemotecisPage() {
  const { identity } = useAuth();
  const remotecis = useSelector(getRemotecisForTeam(identity?.team));
  const isFetching = useSelector(isFetchingRemotecis);
  const dispatch = useDispatch<AppDispatch>();

  const fetchRemoteciCallback = useCallback(() => {
    dispatch(remotecisActions.all({ where: `team_id:${identity?.team?.id}` }));
  }, [dispatch, identity?.team]);

  useEffect(() => {
    fetchRemoteciCallback();
  }, [fetchRemoteciCallback]);

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
      <table className="pf-c-table pf-m-compact pf-m-grid-md">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th>Name</th>
            <th className="text-center">Status</th>
            <th className="text-center" title="Authentication">
              <UserSecretIcon className="mr-xs" /> Authentication
            </th>
            <th className="text-center">Team</th>
            <th>Created</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {remotecis.map((remoteci) => (
            <tr key={`${remoteci.id}.${remoteci.etag}`}>
              <td className="text-center">
                <CopyButton text={remoteci.id} />
              </td>
              <td>{remoteci.name}</td>
              <td className="text-center">
                {remoteci.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </td>
              <td className="text-center">
                <SeeAuthentificationFileModal
                  type="sh"
                  role="remoteci"
                  resource={remoteci}
                  className="mr-xs"
                />
                <SeeAuthentificationFileModal
                  type="yaml"
                  role="remoteci"
                  resource={remoteci}
                />
              </td>
              <td className="text-center">{remoteci?.team?.name}</td>
              <td>{remoteci.from_now}</td>
              <td className="text-center">
                <EditRemoteciModal
                  className="mr-xs"
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
                    <Button isSmall variant="danger" onClick={openModal}>
                      <TrashIcon />
                    </Button>
                  )}
                </ConfirmDeleteModal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainPage>
  );
}
