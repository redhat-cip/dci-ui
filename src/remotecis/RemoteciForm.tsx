import { forwardRef } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { Input, SelectWithTypeahead } from "ui/formik";
import { IRemoteci, ITeam } from "types";

const RemoteciSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Remoteci name is too short!")
    .required("Remoteci name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface RemoteciFormProps {
  remoteci?: IRemoteci;
  teams: ITeam[];
  onSubmit: (remoteci: IRemoteci | Partial<IRemoteci>) => void;
}

const RemoteciForm = forwardRef<
  FormikProps<IRemoteci | Partial<IRemoteci>>,
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
    <Form id="remoteci_form" className="pf-v5-c-form">
      <Input
        id="remoteci_form__name"
        data-testid="remoteci_form__name"
        label="Name"
        name="name"
        isRequired
      />
      <SelectWithTypeahead
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
