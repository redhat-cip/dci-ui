import { useState } from "react";
import * as React from "react";
import { Button } from "@patternfly/react-core";
import {
  TimesIcon,
  CheckIcon,
  PencilAltIcon,
  CommentIcon,
} from "@patternfly/react-icons";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
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
  position: relative;
  align-items: center;
  width: 100%;
  .pencil-icon {
    display: none;
  }
  .comment-icon {
    display: block;
  }
  &:hover .pencil-icon {
    display: block;
  }
  &:hover .comment-icon {
    display: none;
  }
`;
const InlineForm = styled.div`
  display: flex;
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
        <Form {...props}>
          <InlineForm>
            <div style={{ flex: "1" }}>
              <Field
                id="text"
                name="text"
                as="textarea"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  resize: "none",
                }}
                cols={50}
              />
            </div>
            <div style={{ flex: "none" }}>
              <Button
                variant="link"
                type="submit"
                isDisabled={!(isValid && dirty)}
              >
                <CheckIcon />
              </Button>
              <Button
                variant="plain"
                type="button"
                onClick={() => setEditModeOne(false)}
              >
                <TimesIcon />
              </Button>
            </div>
          </InlineForm>
        </Form>
      )}
    </Formik>
  ) : (
    <TextAreaEditable {...props}>
      <div
        tabIndex={0}
        role="button"
        style={{ flex: "none" }}
        className="pointer"
        onClick={() => setEditModeOne(true)}
        onKeyDown={() => setEditModeOne(true)}
      >
        <CommentIcon className="mr-xs comment-icon" />
        <PencilAltIcon className="mr-xs pencil-icon" />
      </div>
      <div style={{ flex: "1" }}>{children}</div>
    </TextAreaEditable>
  );
}
