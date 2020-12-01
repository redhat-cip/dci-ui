import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import remotecisActions from "./remotecisActions";
import teamsActions from "teams/teamsActions";
import { CopyButton, EmptyState, ConfirmDeleteModal } from "ui";
import { getRemotecis, isFetchingRemotecis } from "./remotecisSelectors";
import { getTeams } from "teams/teamsSelectors";
import SeeCredentialsModal from "./SeeCredentialsModal";
import { Button, Label } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { AppDispatch } from "store";
import CreateRemoteciModal from "./CreateRemoteciModal";
import EditRemoteciModal from "./EditRemoteciModal";

export default function RemotecisPage() {
  const remotecis = useSelector(getRemotecis);
  const teams = useSelector(getTeams);
  const isFetching = useSelector(isFetchingRemotecis);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(remotecisActions.all({ embed: "team" }));
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <Page
      title="Remotecis"
      loading={isFetching && isEmpty(remotecis)}
      empty={!isFetching && isEmpty(remotecis)}
      HeaderButton={
        <CreateRemoteciModal
          teams={teams}
          onSubmit={(newRemoteci) => {
            dispatch(remotecisActions.create(newRemoteci));
          }}
        />
      }
      EmptyComponent={
        <EmptyState
          title="There is no remotecis"
          info="Do you want to create one?"
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
              Authentication
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
                <SeeCredentialsModal remoteci={remoteci} />
              </td>
              <td className="text-center">
                {remoteci.team ? remoteci.team.name.toUpperCase() : null}
              </td>
              <td>{remoteci.from_now}</td>
              <td className="text-center">
                <EditRemoteciModal
                  className="mr-xs"
                  remoteci={remoteci}
                  teams={teams}
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
                    <Button variant="danger" onClick={openModal}>
                      <TrashIcon />
                    </Button>
                  )}
                </ConfirmDeleteModal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
}
