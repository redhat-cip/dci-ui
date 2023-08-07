import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import feedersActions from "./feedersActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { getFeeders, isFetchingFeeders } from "./feedersSelectors";
import { TrashIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";
import { AppDispatch } from "store";
import { useNavigate, Link } from "react-router-dom";
import { SeeAuthentificationFileModal } from "ui/Credentials";
import teamsActions from "teams/teamsActions";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

export default function FeedersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const feeders = useSelector(getFeeders);
  const navigate = useNavigate();
  const isFetching = useSelector(isFetchingFeeders);

  useEffect(() => {
    dispatch(feedersActions.all());
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <MainPage
      title="Feeders"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      loading={isFetching && isEmpty(feeders)}
      empty={!isFetching && isEmpty(feeders)}
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
          {feeders.map((feeder) => (
            <Tr key={`${feeder.id}.${feeder.etag}`}>
              <Td className="text-center">
                <CopyButton text={feeder.id} />
              </Td>
              <Td>
                <Link to={`/feeders/${feeder.id}`}>{feeder.name}</Link>
              </Td>
              <Td>{feeder.team ? feeder.team.name.toUpperCase() : null}</Td>
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
              <Td className="text-center">{feeder.from_now}</Td>
              <Td className="text-center">
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
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </MainPage>
  );
}
