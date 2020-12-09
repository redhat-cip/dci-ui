import React from "react";
import { Button } from "@patternfly/react-core";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { SelectWithSearch } from "ui/formik";
import { IRemoteci } from "types";

interface INewRemoteciSubscription {
  remoteci_id: string;
}

const CreateFeederSchema = Yup.object().shape({
  remoteci_id: Yup.string().nullable().required("Remoteci is required"),
});

interface UnsubscribeFormProps {
  remotecis:IRemoteci[]
  onSubmit: (subscription: INewRemoteciSubscription) => void;
}

export default function UnsubscribeForm({
  remotecis,
  onSubmit,
}: UnsubscribeFormProps) {
  return (
    <Formik
      initialValues={{ remoteci_id: "" }}
      validationSchema={CreateFeederSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="unsubscribe_form" className="pf-c-form">
          <SelectWithSearch
            id="unsubscribe_form__remoteci_id"
            label="Subscribed RemoteCI"
            placeholder="Subscribed RemoteCI"
            name="remoteci_id"
            options={remotecis.map((r) => ({ label: r.name, value: r.id }))}
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Unsubscribe
          </Button>
        </Form>
      )}
    </Formik>
  );
}
