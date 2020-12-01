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

interface SubscribeFormProps {
  remotecis: IRemoteci[];
  onSubmit: (subscription: INewRemoteciSubscription) => void;
}

export default function SubscribeForm({
  remotecis,
  onSubmit,
}: SubscribeFormProps) {
  return (
    <Formik
      initialValues={{ remoteci_id: "" }}
      validationSchema={CreateFeederSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id="subscribe_form" className="pf-c-form">
          <SelectWithSearch
            id="subscribe_form__remoteci_id"
            label="Available Remotecis"
            placeholder="Available Remotecis"
            name="remoteci_id"
            options={remotecis.map((r) => ({ label: r.name, value: r.id }))}
          />
          <Button
            variant="primary"
            type="submit"
            isDisabled={!(isValid && dirty)}
          >
            Subscribe
          </Button>
        </Form>
      )}
    </Formik>
  );
}
