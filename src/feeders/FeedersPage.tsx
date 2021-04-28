import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import feedersActions from "./feedersActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { getFeeders, isFetchingFeeders } from "./feedersSelectors";
import { TrashIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";
import { AppDispatch } from "store";
import { useHistory, Link } from "react-router-dom";
import SeeCredentialsModal from "ui/SeeCredentialsModal";

export default function FeedersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const feeders = useSelector(getFeeders);
  const history = useHistory();
  const isFetching = useSelector(isFetchingFeeders);

  useEffect(() => {
    dispatch(feedersActions.all({ embed: "team" }));
  }, [dispatch]);

  return (
    <Page
      title="Feeders"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      loading={isFetching && isEmpty(feeders)}
      empty={!isFetching && isEmpty(feeders)}
      HeaderButton={
        <Button
          variant="primary"
          onClick={() => history.push("/feeders/create")}
        >
          <PlusCircleIcon className="mr-xs" />
          Create a new feeder
        </Button>
      }
      EmptyComponent={
        <EmptyState
          title="There is no feeders"
          info="Do you want to create one?"
        />
      }
      breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Feeders" }]} />
      }
    >
      <table className="pf-c-table pf-m-compact pf-m-grid-md">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th>Name</th>
            <th>Team Owner</th>
            <th className="text-center" title="Authentication">
              Authentication
            </th>
            <th className="text-center">Created</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeders.map((feeder) => (
            <tr key={`${feeder.id}.${feeder.etag}`}>
              <td className="text-center">
                <CopyButton text={feeder.id} />
              </td>
              <td>
                <Link to={`/feeders/${feeder.id}`}>{feeder.name}</Link>
              </td>
              <td>{feeder.team ? feeder.team.name.toUpperCase() : null}</td>
              <td className="text-center">
                <SeeCredentialsModal role="feeder" credentials={feeder} />
              </td>
              <td className="text-center">{feeder.from_now}</td>
              <td className="text-center">
                <ConfirmDeleteModal
                  title={`Delete feeder ${feeder.name}`}
                  message={`Are you sure you want to delete ${feeder.name}?`}
                  onOk={() => dispatch(feedersActions.delete(feeder))}
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
