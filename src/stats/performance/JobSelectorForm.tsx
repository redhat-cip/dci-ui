import React from "react";
import { Button } from "@patternfly/react-core";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { TextArea } from "ui/formik";

const JobSelectorFormSchema = Yup.object().shape({
  jobsIds: Yup.string().required("List of jobs ids is required"),
});

interface JobSelectorFormProps {
  jobsIds: string[];
  onSubmit: (jobsIds: string[]) => void;
}

export default function JobSelectorForm({
  jobsIds,
  onSubmit,
}: JobSelectorFormProps) {
  return (
    <Formik
      initialValues={{ jobsIds: jobsIds.join("\n") }}
      validationSchema={JobSelectorFormSchema}
      onSubmit={({ jobsIds }) => onSubmit(jobsIds.trim().split("\n"))}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="pf-c-form">
            <TextArea
              id="performance-job-selector-form__jobsIds"
              label="Jobs ids"
              name="jobsIds"
              placeholder="List of jobs you want to compare. One job per line. First job id is used as a base."
              required
            />
            <Button
              type="submit"
              variant="primary"
              isDisabled={!(isValid && dirty)}
            >
              See performance results
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}
