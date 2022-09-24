import { useState } from "react";
import * as React from "react";
import { Button } from "@patternfly/react-core";
import { TimesIcon, CheckIcon } from "@patternfly/react-icons";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import styled from "styled-components";
import { global_palette_black_700 } from "@patternfly/react-tokens";

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
  width: 100%;
  min-height: 56px;
  cursor: text;
  font-size: 0.8em;
  &:hover {
    border: 1px solid ${global_palette_black_700.value};
    border-radius: 2px;
  }
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
          <div>
            <div>
              <Field
                id="text"
                name="text"
                as="textarea"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  resize: "none",
                  padding: "0.2em",
                }}
                cols={50}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="control"
                type="submit"
                isInline
                isSmall
                isDisabled={!(isValid && dirty)}
              >
                <CheckIcon />
              </Button>
              <Button
                variant="control"
                type="button"
                isInline
                isSmall
                onClick={() => setEditModeOne(false)}
                className="ml-xs"
              >
                <TimesIcon />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    <TextAreaEditable
      {...props}
      onClick={() => {
        setEditModeOne(true);
      }}
    >
      {children}
    </TextAreaEditable>
  );
}
