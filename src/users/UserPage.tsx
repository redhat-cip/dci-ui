import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Content,
  CardTitle,
  PageSection,
} from "@patternfly/react-core";
import UserForm from "./UserForm";
import { TrashAltIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb, EmptyState } from "ui";
import { useParams, useNavigate } from "react-router";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "./usersApi";
import { skipToken } from "@reduxjs/toolkit/query";
import LoadingPageSection from "ui/LoadingPageSection";
import { UserTeamsTable } from "./UserTeamsTable";

export default function UserPage() {
  const navigate = useNavigate();
  const { user_id } = useParams();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const { data: user, isLoading } = useGetUserQuery(
    user_id ? user_id : skipToken,
  );

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!user) {
    return <EmptyState title="No user" info={`User ${user_id} not found`} />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/users", title: "Users" },
          { to: `/users/${user_id}`, title: user_id },
        ]}
      />
      <Content component="h1">{`Edit user ${user.fullname}`}</Content>
      <Content component="p">{`Details page for user ${user.name}`}</Content>
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <UserForm id="user-edit-form" user={user} onSubmit={updateUser} />
              <Button
                variant="primary"
                type="submit"
                form="user-edit-form"
                className="pf-v6-u-mt-md"
                isDisabled={isUpdating}
              >
                Edit
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card>
            <CardTitle>User teams</CardTitle>
            <CardBody>
              <UserTeamsTable user={user} />
            </CardBody>
          </Card>
          <Card className="pf-v6-u-mt-lg">
            <CardTitle>
              <span
                style={{ color: t_global_color_status_danger_default.value }}
              >
                {`Delete ${user.name} user`}
              </span>
            </CardTitle>
            <CardBody>
              <Content
                component="p"
                style={{ color: t_global_color_status_danger_default.value }}
              >
                Once you delete a user, there is no going back. Please be
                certain.
              </Content>

              <ConfirmDeleteModal
                title={`Delete user ${user.name}`}
                message={`Are you sure you want to delete ${user.name} user?`}
                onOk={() => deleteUser(user).then(() => navigate("/users"))}
              >
                {(openModal) => (
                  <Button
                    icon={<TrashAltIcon className="pf-v6-u-mr-sm" />}
                    variant="danger"
                    onClick={openModal}
                  >
                    Delete this user
                  </Button>
                )}
              </ConfirmDeleteModal>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
}
