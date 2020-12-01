import React from "react";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { Input, SelectWithSearch } from "ui/formik";
import { INewRemoteci, IRemoteci, ITeam, IEditRemoteci } from "types";

const RemoteciSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Remoteci name is too short!")
    .required("Remoteci name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface RemoteciFormProps {
  remoteci?: IRemoteci;
  teams: ITeam[];
  onSubmit: (remoteci: INewRemoteci | IEditRemoteci) => void;
}

const RemoteciForm = React.forwardRef<
  FormikProps<INewRemoteci | IEditRemoteci>,
  RemoteciFormProps
>(({ remoteci, teams, onSubmit }, formRef) => (
  <Formik
    innerRef={formRef}
    initialValues={
      remoteci || { name: "", team_id: teams.length > 0 ? teams[0].id : "" }
    }
    validationSchema={RemoteciSchema}
    onSubmit={onSubmit}
  >
    <Form id="remoteci_form" className="pf-c-form">
      <Input
        id="remoteci_form__name"
        data-testid="remoteci_form__name"
        label="Name"
        name="name"
        isRequired
        autoFocus
      />
      <SelectWithSearch
        id="remoteci_form__team_id"
        label="Team Owner"
        placeholder="Team Owner"
        name="team_id"
        options={teams.map((t) => ({ label: t.name, value: t.id }))}
        isRequired
      />
    </Form>
  </Formik>
));

export default RemoteciForm;
