import { useRef, useEffect } from "react";
import * as React from "react";
import { FormikProps, Formik, Form } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import * as Yup from "yup";
import { IEnhancedUser, ITeam } from "types";
import { SelectWithSearch } from "ui/formik";
import useModal from "hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store";
import { getUsers, isFetchingUsers } from "users/usersSelectors";
import usersActions from "users/usersActions";

interface INewUserToTeam {
  user_id: string;
}

const NewUserToTeamSchema = Yup.object().shape({
  user_id: Yup.string().nullable().required("User is required"),
});

interface AddUserToTeamModalProps {
  team: ITeam;
  onSubmit: (newUser: IEnhancedUser) => void;
  children: (open: () => void, isLoading: boolean) => React.ReactNode;
}

export default function AddUserToTeamModal({
  team,
  onSubmit,
  children,
}: AddUserToTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewUserToTeam>>(null);

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(getUsers);
  const isFetching = useSelector(isFetchingUsers);

  useEffect(() => {
    dispatch(usersActions.all());
  }, [dispatch]);

  return (
    <>
      <Modal
        id="add_user_to_team_modal"
        variant={ModalVariant.medium}
        title={`Add a user to ${team.name} team`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="add"
            variant="primary"
            onClick={() => {
              if (formRef.current) {
                hide();
                formRef.current.handleSubmit();
              }
            }}
          >
            Add
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <Formik
          innerRef={formRef}
          initialValues={{ user_id: "" }}
          validationSchema={NewUserToTeamSchema}
          onSubmit={({ user_id }) => {
            const user = users.find((u) => u.id === user_id);
            if (user) {
              onSubmit(user);
            }
          }}
        >
          <Form id="user_to_team_form" className="pf-c-form">
            <SelectWithSearch
              id="user_to_team_form__user"
              label="Select a user"
              placeholder="contact@example.org"
              name="user_id"
              options={users.map((u) => ({ label: u.email, value: u.id }))}
            />
          </Form>
        </Formik>
      </Modal>
      {children(show, isFetching)}
    </>
  );
}
