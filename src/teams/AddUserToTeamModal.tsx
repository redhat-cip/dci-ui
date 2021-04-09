import React, { useRef } from "react";
import { FormikProps, Formik, Form } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import * as Yup from "yup";
import { ITeam, IUser } from "types";
import { SelectWithSearch } from "ui/formik";
import useModal from "hooks/useModal";

interface INewUserToTeam {
  user_id: string;
}

const NewUserToTeamSchema = Yup.object().shape({
  user_id: Yup.string().nullable().required("User is required"),
});

interface AddUserToTeamModalProps {
  team: ITeam;
  users: IUser[];
  onSubmit: (newUser: INewUserToTeam) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function AddUserToTeamModal({
  team,
  users,
  onSubmit,
  children
}: AddUserToTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewUserToTeam>>(null);
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
          onSubmit={onSubmit}
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
      {children(show)}
    </>
  );
}
