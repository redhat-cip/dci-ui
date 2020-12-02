import React, { useState } from "react";
import { Button } from "@patternfly/react-core";
import { TimesIcon, CheckIcon, PencilAltIcon } from "@patternfly/react-icons";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { TextArea } from "./formik";
import styled from "styled-components";

interface TextAreaEditableOnHoverProps {
  text: string;
  onSubmit: (text: string) => void;
  children: React.ReactNode;
  [x: string]: any;
}

const TextAreaEditableOnHoverSchema = Yup.object().shape({
  text: Yup.string(),
});

const TextAreaEditable = styled.div`
  display: flex;
  align-items: center;
  &:hover .text_editable__button {
    display: inline;
  }
`;

const EditButton = styled(Button)`
  display: none;
  padding-top: 0;
  padding-bottom: 0;
`;

export default function TextAreaEditableOnHover({
  text,
  onSubmit,
  children,
  ...props
}: TextAreaEditableOnHoverProps) {
  const [editModeOn, setEditModeOne] = useState(false);

  return editModeOn ? (
    <Formik
      initialValues={{ text }}
      validationSchema={TextAreaEditableOnHoverSchema}
      onSubmit={(v) => {
        setEditModeOne(false);
        onSubmit(v.text);
      }}
    >
      {({ isValid, dirty }) => (
        <Form className="pf-c-inline-edit pf-m-inline-editable" {...props}>
          <div className="pf-c-inline-edit__group">
            <div className="pf-c-inline-edit__input">
              <TextArea id="text" name="text" type="text" autoFocus />
            </div>
            <div className="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group">
              <Button
                variant="link"
                type="submit"
                isDisabled={!(isValid && dirty)}
              >
                <CheckIcon />
              </Button>
              <div className="pf-c-inline-edit__action">
                <Button
                  variant="plain"
                  type="button"
                  onClick={() => setEditModeOne(false)}
                >
                  <TimesIcon />
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    <TextAreaEditable {...props}>
      <div>{children}</div>
      <div>
        <EditButton
          variant="plain"
          type="button"
          isSmall
          onClick={() => setEditModeOne(true)}
          className="text_editable__button"
        >
          <PencilAltIcon />
        </EditButton>
      </div>
    </TextAreaEditable>
  );
}
